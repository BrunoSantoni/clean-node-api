import { ObjectId } from 'mongodb';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { MongoHelper, SaveSurveyResultRepository } from './survey-result-mongo-repository-protocols';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('survey_results');

    await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(surveyData.surveyId),
      accountId: new ObjectId(surveyData.accountId),
    }, {
      $set: {
        answer: surveyData.answer,
        date: surveyData.date,
      },
    }, {
      upsert: true,
    });

    const surveyResult = await this.loadBySurveyId(surveyData.surveyId);

    return surveyResult;
  }

  private async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('survey_results');
    const query = surveyResultCollection.aggregate(
      [
        {
          $match: {
            surveyId: new ObjectId(surveyId),
          },
        },
        {
          $group: {
            _id: 0,
            data: {
              $push: '$$ROOT', // Pegou tudo que estava dentro do $match
            },
            count: {
              $sum: 1, // Adicionando propriedade count com uma soma de 1
            },
          },
        },
        {
          $unwind: {
            path: '$data', // Fez o array de data virar vários objetos
          },
        },
        {
          $lookup: { // Lookup é o join do aggregate do Mongo
            from: 'surveys',
            foreignField: '_id',
            localField: 'data.surveyId',
            as: 'survey',
          },
        },
        {
          $unwind: {
            path: '$survey', // O lookup retorna um array, re-convertendo pra objeto
          },
        },
        {
          $group: {
            _id: {
              surveyId: '$survey._id',
              question: '$survey.question',
              date: '$survey.date',
              total: '$count',
              answer: {
                $filter: { // Filtrar answers iguais
                  input: '$survey.answers',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.answer', '$data.answer'],
                  },
                },
              },
            },
            count: { // Como o outro count virou o Total, esse será o count de quantas respostas iguais tem
              $sum: 1,
            },
          },
        },
        {
          $unwind: {
            path: '$_id.answer', // Transformando o array de answers em vários objetos.
          },
        },
        {
          $addFields: {
            '_id.answer.count': '$count',
            '_id.answer.percent': {
              $multiply: [{
                $divide: ['$count', '$_id.total'],
              }, 100],
            },
          },
        },
        {
          $group: { // As perguntas estavam com o surveyId, question e date duplicados, juntou todos e criou um array com as answers
            _id: {
              surveyId: '$_id.surveyId',
              question: '$_id.question',
              date: '$_id.date',
            },
            answers: {
              $push: '$_id.answer',
            },
          },
        },
        {
          $project: {
            _id: 0, // Indica que não vai retornar o id
            surveyId: '$_id.surveyId',
            question: '$_id.question',
            date: '$_id.date',
            answers: '$answers',
          },
        },
      ],
    );

    const surveyResult = await query.toArray();

    return surveyResult.length ? surveyResult[0] as SurveyResultModel : null;
  }
}
