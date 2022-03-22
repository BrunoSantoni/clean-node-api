import { ObjectId } from 'mongodb';
import round from 'mongo-round';
import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/data/protocols/db';
import { SaveSurveyResultParams } from '@/domain/usecases';
import { SurveyResultModel } from '@/domain/models';
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async save(surveyData: SaveSurveyResultParams): Promise<void> {
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
  }

  async loadBySurveyId(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('survey_results');
    const query = new QueryBuilder()
      .match({ surveyId: new ObjectId(surveyId) })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT', // Pegou tudo que estava dentro do $match
        },
        total: {
          $sum: 1, // Adicionando propriedade total com uma soma de 1
        },
      })
      // Fez o array de data virar vários objetos
      .unwind({ path: '$data' })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey',
      })
      .unwind({
        path: '$survey',
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers',
        },
        count: { // Esse será o count de quantas respostas iguais tem
          $sum: 1,
        },
        currentAccountAnswer: {
          $push: {
            $cond: [{
              $eq: ['$data.accountId', new ObjectId(accountId)],
            }, '$data.answer', null],
          },
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: ['$$item',
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$_id.answer', '$$item.answer'],
                      },
                      then: '$count',
                      else: 0,
                    },
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$_id.answer', '$$item.answer'],
                      },
                      then: {
                        $multiply: [{
                          $divide: ['$count', '$_id.total'],
                        }, 100],
                      },
                      else: 0,
                    },
                  },
                  isUserCurrentAnswer: {
                    $eq: ['$$item.answer', {
                      $arrayElemAt: ['$currentAccountAnswer', 0], // Pegou o primeiro item do array
                    }],
                  },
                },
              ],
            },
          },
        },
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answers', // Convertendo todos os answers em um só array
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this'],
            },
          },
        },
      })
      .unwind({
        path: '$answers', // Transformando o array de answers em vários objetos.
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image',
          isUserCurrentAnswer: '$answers.isUserCurrentAnswer',
        },
        count: {
          $sum: '$answers.count',
        },
        percent: {
          $sum: '$answers.percent',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: round('$count'),
          percent: round('$percent'),
          isUserCurrentAnswer: '$_id.isUserCurrentAnswer',
        },
      })
      .sort({
        'answer.count': -1,
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answer', // Juntando todas as answers em um só array
        },
      })
      .project({
        _id: 0, // Indica que não vai retornar o id
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers',
      })
      .build();

    const surveyResult = await surveyResultCollection.aggregate(query).toArray();

    return surveyResult.length ? surveyResult[0] as SurveyResultModel : null;
  }
}
