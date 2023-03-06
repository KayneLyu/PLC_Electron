/// <reference types="vite/client" />

interface WorkerMessage<O, R> {
  Method: string;
  Options?: O;
  Result?: R;
  Error?: string;
}
