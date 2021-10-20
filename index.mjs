import { Readable, pipeline, Writable, Transform } from "stream";
import { promisify } from "util";
import { createWriteStream } from "fs";

const pipelineAsync = promisify(pipeline);

const readableStream = Readable({
  read() {
    for (let i = 0; i < 1e5; i++) {
      const person = {
        id: Date.now() + i,
        name: `Thiago-${i}`,
      };
      const data = JSON.stringify(person);
      this.push(data); // Passa pra frente no pipeline o chunk de dados
    }

    this.push(null);
  },
});

const writableStream = Transform({
  transform(chunk, encoding, callback) {
    const result = JSON.parse(chunk);
    callback(null, `${result.id} ${result.name} \n`);
  },
});

(async () => {
  await pipelineAsync(
    readableStream,
    writableStream,
    createWriteStream("my.csv")
  );
})();
