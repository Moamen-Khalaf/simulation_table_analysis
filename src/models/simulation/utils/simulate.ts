import { getPosition } from "../../../utils/parseExcel";
import {
  ColumnHeader,
  type cellType,
  type IColumnHeader,
  type UserRow,
} from "../types";

enum Methods {
  SUM = "SUM",
  MAX = "MAX",
  MIN = "MIN",
  AVERAGE = "AVERAGE",
  COUNT = "COUNT",
  IF = "IF",
}
export default function simulate(users: UserRow[]): cellType[][] {
  let clock = 0;
  const tableHeaders = Object.values(ColumnHeader);
  let lastUser: UserRow = tableHeaders.reduce((acc, key) => {
    acc[key as IColumnHeader] = {
      v: "",
      f: "",
      pos: "NULL",
    } as cellType;
    return acc;
  }, {} as UserRow);
  const usersData = users.map((user) => {
    clock += +user.INTERARRIVAL_TIME.v;
    const arrivalTime = +clock;
    const serviceTime = +user.SERVICE_TIME.v;
    const timeServBeg = Math.max(arrivalTime, +lastUser.TIME_SER_ENDS.v);
    const timeServEnds = timeServBeg + serviceTime;
    const custState =
      timeServBeg > arrivalTime ? String(timeServBeg - arrivalTime) : "SERV";
    const systemState =
      arrivalTime - +lastUser.TIME_SER_ENDS.v > 0
        ? arrivalTime - +lastUser.TIME_SER_ENDS.v
        : "BUSY";

    user.ARRIVAL_TIME.v = arrivalTime.toString();
    user.ARRIVAL_TIME.f = `${Methods.SUM}(${user.INTERARRIVAL_TIME.pos},${lastUser.ARRIVAL_TIME.pos})`;

    user.TIME_SER_BEG.v = timeServBeg.toString();
    user.TIME_SER_BEG.f = `${Methods.MAX}(${user.ARRIVAL_TIME.pos},${lastUser.TIME_SER_ENDS.pos})`;

    user.SERVICE_TIME.v = serviceTime.toString();

    user.TIME_SER_ENDS.v = timeServEnds.toString();
    user.TIME_SER_ENDS.f = `${Methods.SUM}(${user.TIME_SER_BEG.pos},${user.SERVICE_TIME.pos})`;

    user.CUST_STATE.v = custState;
    user.CUST_STATE.f = `${Methods.IF}(${user.TIME_SER_BEG.pos}>${user.ARRIVAL_TIME.pos},"${custState}","SERV")`;

    user.SYSTEM_STATE.v = systemState.toString();
    user.SYSTEM_STATE.f = `${Methods.IF}(${user.ARRIVAL_TIME.pos}-${lastUser.TIME_SER_ENDS.pos}>0,"${systemState}","BUSY")`;

    lastUser = user;
    return user;
  });
  const simulationTable = [
    tableHeaders.map((key, index) => ({
      v: key,
      pos: getPosition(index, 0),
      f: "",
    })) as cellType[],
    ...Object.values(usersData).map((user) => {
      return tableHeaders.map((key) => user[key as IColumnHeader]);
    }),
  ] as cellType[][];
  console.log(simulationTable);
  return simulationTable;
}
