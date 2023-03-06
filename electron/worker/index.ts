import { BuildElectronModule, SendMessage } from '../utils/ElectronModule';
import { resolve } from 'path';
import nodeS7 from 'nodes7';

const variables = {
  TEST1: 'M100',
};
let connect: nodeS7;
connect = new nodeS7();
const worker = {
  initConnect: () => {
    // connect = new nodeS7();
    // connect?.addItems(variables.TEST1)
    return new Promise((resolve, reject) => {
      connect.initiateConnection(
        {
          port: 102,
          host: '192.168.2.10',
          rack: 0,
          slot: 0,
        },
        err => {
          if (err) {
            if (typeof(err) !== "undefined") {
              // We have an error. Maybe the PLC is not reachable.
              console.log(err);
              reject(err);
            }
          } else {
            resolve(true);
          }
        },
      );
    });
  },
  addItem: () => {
    connect?.addItems(variables.TEST1);
    return new Promise((resolve, reject) => {
      connect?.writeItems(variables.TEST1, true, err => {
        if (err) {
          console.log('写入失败。。。');
        } else {
          console.log('写入完成');
        }
      });
    });
  },
  test: () => {
    connect?.addItems(variables.TEST1);
    return new Promise((resolve, reject) => {
      connect?.readAllItems((err, data) => {
        if (err) {
          console.log('读取失败。。。');
          reject(err);
        } else {
          console.log('plc读取结果', data);
          resolve(data);
        }
      });
    })
  }, 
  // test: ({ name }: { name: string }) => {
  //   SendMessage<string, string>({
  //     Method: 'worker:test',
  //     Result: 'test Init',
  //   });

  //   let doneReading = false;
  //   let doneWriting = false;

  //   function valuesReady(anythingBad, values) {
  //     if (anythingBad) {
  //       console.log('读取失败。。。');
  //     }
  //     console.log('plc读取结果', values);
  //     doneReading = true;
  //     if (doneWriting) {
  //       process.exit();
  //     }
  //   }
  //   function valuesWritten(anythingBad) {
  //     if (anythingBad) {
  //       console.log('写入失败。。。');
  //     }
  //     console.log('写入完成');
  //     doneWriting = true;
  //     if (doneReading) {
  //       process.exit();
  //     }
  //   }

  //   const connect = new nodeS7();
  //   connect.initiateConnection(
  //     {
  //       port: 102,
  //       host: '192.168.2.10',
  //       rack: 0,
  //       slot: 2,
  //     },
  //     err => {
  //       if (err) {
  //         // 连接失败
  //         console.log('连接plc出错：', err);

  //         // process.exit()
  //       } else {
  //         connect.setTranslationCB(function (tag) {
  //           return variables[tag];
  //         });
  //         // connect.addItems(['TEST1', 'TEST4']);
  //         connect.addItems('TEST1');
  //         connect.readAllItems(valuesReady);
  //       }
  //     },
  //   );
  //   return `TEST OK! ${name}`;
  // },
};

BuildElectronModule(worker);
