declare module "socket.io-mock" {
  class MockedSocket {
    id: string;
    emit(event: string, ...args: any[]): void;
    on(event: string, callback: (...args: any[]) => void): void;
    socketClient: MockedSocket; // For mocked client instance
  }

  export default MockedSocket;
}
