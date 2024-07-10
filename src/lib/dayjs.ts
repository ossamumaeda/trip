import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedformat';
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')
dayjs.extend(localizedFormat)

export {dayjs}