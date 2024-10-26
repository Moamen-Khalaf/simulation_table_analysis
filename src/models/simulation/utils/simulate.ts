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
function simulateData(users: UserRow[], lastUser: UserRow) {
  let clock = 0;
  return users.map((user, index) => {
    clock += +user.INTERARRIVAL_TIME.v;
    const arrivalTime = clock;
    const serviceTime = +user.SERVICE_TIME.v;
    const timeServBeg = Math.max(arrivalTime, +lastUser.TIME_SER_ENDS.v);
    const timeServEnds = timeServBeg + serviceTime;
    const custState =
      timeServBeg > arrivalTime
        ? (timeServBeg - arrivalTime).toString()
        : "SERV";
    const systemState =
      arrivalTime > +lastUser.TIME_SER_ENDS.v
        ? (arrivalTime - +lastUser.TIME_SER_ENDS.v).toString()
        : "BUSY";

    user.ARRIVAL_TIME.v = arrivalTime.toString();
    user.TIME_SER_BEG.v = timeServBeg.toString();
    user.SERVICE_TIME.v = serviceTime.toString();
    user.TIME_SER_ENDS.v = timeServEnds.toString();
    user.CUST_STATE.v = custState;
    user.SYSTEM_STATE.v = systemState;

    if (index > 0) {
      user.ARRIVAL_TIME.f = `${user.INTERARRIVAL_TIME.pos}+${lastUser.ARRIVAL_TIME.pos}`;
      user.TIME_SER_BEG.f = `${Methods.MAX}(${user.ARRIVAL_TIME.pos},${lastUser.TIME_SER_ENDS.pos})`;
      user.TIME_SER_ENDS.f = `${user.TIME_SER_BEG.pos}+${user.SERVICE_TIME.pos}`;
      user.CUST_STATE.f = `${Methods.IF}(${user.TIME_SER_BEG.pos}>${user.ARRIVAL_TIME.pos},${user.TIME_SER_BEG.pos}-${user.ARRIVAL_TIME.pos},"SERV")`;
      user.SYSTEM_STATE.f = `${Methods.IF}(${user.ARRIVAL_TIME.pos}-${lastUser.TIME_SER_ENDS.pos}>0,${user.ARRIVAL_TIME.pos}-${lastUser.TIME_SER_ENDS.pos},"BUSY")`;
    }

    lastUser = user;
    return user;
  });
}
export default function simulate(users: UserRow[]): cellType[][] {
  const tableHeaders = Object.values(ColumnHeader);
  const lastUser = tableHeaders.reduce(
    (acc, key) => ({ ...acc, [key]: { v: "0", pos: "" } }),
    {} as UserRow
  );
  const usersData = simulateData(users, lastUser);
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
  return simulationTable;
}
