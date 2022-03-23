import faker from '@faker-js/faker';
import { success, serverError } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';
import { LogControllerDecorator } from '@/main/decorators';
import { LogErrorRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: LogControllerDecorator;
  controllerSpy: ControllerSpy;
  logErrorRepositorySpy: LogErrorRepositorySpy;
};

const mockServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = faker.random.words();
  return serverError(fakeError);
};

class ControllerSpy implements Controller {
  request: any;

  httpResponse = success(faker.datatype.uuid());

  async handle(request: any): Promise<HttpResponse> {
    this.request = request;
    return Promise.resolve(this.httpResponse);
  }
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy();
  const logErrorRepositorySpy = new LogErrorRepositorySpy();
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy);

  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy,
  };
};
describe('LogController Decorator', () => {
  test('Should call controller handle with correct values', async () => {
    const { sut, controllerSpy } = makeSut();

    const request = faker.lorem.sentence();
    await sut.handle(request);

    expect(controllerSpy.request).toEqual(request);
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut();

    const serverErrorResponse = mockServerError();
    controllerSpy.httpResponse = serverErrorResponse;

    await sut.handle(faker.lorem.sentence());

    expect(logErrorRepositorySpy.stack).toBe(serverErrorResponse.body.stack);
  });

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut();

    const httpResponse = await sut.handle(faker.lorem.sentence());

    expect(httpResponse).toEqual(controllerSpy.httpResponse);
  });
});
