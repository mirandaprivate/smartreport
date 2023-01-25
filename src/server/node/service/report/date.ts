import {getDateByDistance} from '@logi/src/http/date'
import {
    CalculateDateRequest,
    CalculateDateResponse,
    CalculateDateResponseBuilder,
    CalculateDateBuilder,
} from '@logi-pb/src/proto/inner/report_pb'

export function calculateDate(
    req: CalculateDateRequest
): CalculateDateResponse {
    const res = req.descs.map(desc => {
        const date = new Date(desc.date)
        const newDate = getDateByDistance(date, desc.distance, desc.freq)
        return new CalculateDateBuilder()
            .id(desc.id)
            .date(formatlogiDate(newDate))
            .build()
    })

    return new CalculateDateResponseBuilder().dates(res).build()
}

function formatlogiDate(date: Date): string {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
}
