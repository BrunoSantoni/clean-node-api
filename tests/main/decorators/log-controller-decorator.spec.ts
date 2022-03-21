import faker from '@faker-js/faker';
import { success, serverError } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { LogControllerDecorator } from '@/main/decorators';
import { LogErrorRepositorySpy } from '@/tests/data/mocks';
import { mockAccountModel } from '@/tests/domain/mocks';

type SutTypes = {
  sut: LogControllerDecorator;
  controllerSpy: ControllerSpy;
  logErrorRepositorySpy: LogErrorRepositorySpy;
};

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password();

  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password,
    },
  };
};

const mockServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = faker.random.words();
  return serverError(fakeError);
};

class ControllerSpy implements Controller {
  httpRequest: HttpRequest;

  httpResponse = success(mockAccountModel());

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest;
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
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut();

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(controllerSpy.httpRequest).toEqual(httpRequest);
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut();

    const serverErrorResponse = mockServerError();
    controllerSpy.httpResponse = serverErrorResponse;

    await sut.handle(mockRequest());

    expect(logErrorRepositorySpy.stack).toBe(serverErrorResponse.body.stack);
  });

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(controllerSpy.httpResponse);
  });
});
