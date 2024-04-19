import { format } from 'date-fns';

export default function FormatDate (date) {
    return format(date, 'yyyy-MM-dd')
}