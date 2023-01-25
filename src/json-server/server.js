// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonServer = require('json-server')
const server = jsonServer.create()

const middlewares = jsonServer.defaults()
server.use(jsonServer.bodyParser)
server.use(middlewares)

// server.post('/v1/data/dataSeriesValue', (req, res) => {
//     console.log(req.body)
//     // console.log(res)
// })
let PLACEHOLDER_ID = 1
server.use((req, res, next) => {
    if (req.method === 'GET') {
        console.log(req.url)
        if (req.url === '/v1/classifications')
            res.json({types: new Array(20).fill(1).map((_, i) => {
                return {
                    id: `classfication id${i}`,
                    name: `classfication name ${i}`,
                }
            })})
        else if (req.url === '/v1/reportTypes')
            res.json({types: new Array(20).fill(1).map((_, i) => {
                return {
                    id: `report types id${i}`,
                    name: `report types name ${i}`,
                }
            })})
        else if (req.url === '/v1/reportTags')
            res.json({types: new Array(20).fill(1).map((_, i) => {
                return {
                    id: `report tags id${i}`,
                    name: `report tags name ${i}`,
                }
            })})
        else if (req.url === '/v1/perm/readAvailableUsers?reportId=1')
            res.json({users: new Array(20).fill(1).map((_, i) => {
                return {
                    id: `read available users id${i}`,
                    full_name: `read available users name ${i}`,
                }
            })})
        else if (req.url === '/v1/perm/writeAvailableUsers?reportId=1')
            res.json({users: new Array(20).fill(1).map((_, i) => {
                return {
                    id: `write available users id${i}`,
                    full_name: `write available users name ${i}`,
                }
            })})
    }
    if (req.method === 'POST') {
        if (req.url === '/v1/data/placeholder') {
            res.json({id: PLACEHOLDER_ID++})
        }
        if (req.url === '/api/library/v1/data/dataSeriesValue') {
            const id = req.body.items[0].id
            const isTimeSeries = req.body.items[0].isTimeSeries
            console.log('is timeseries:', isTimeSeries)
            console.log(id)
            if (id === 'day')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            is_timeseries: true,
                            dataType: 3,
                            format: '万元',
                            values: genDates('2020-01-01', 100).map((time, i) => {
                                return {
                                    value: {d: i},
                                    date: time,
                                }
                            }),
                        }],
                    },
                })
            else if (id === 'day1')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            is_timeseries: true,
                            dataType: 3,
                            format: '万元',
                            values: [],
                        }],
                    },
                })
            else if (id === 'day2')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            is_timeseries: false,
                            dataType: 3,
                            format: '万元',
                            values: [],
                        }],
                    },
                })
            else if (id === 'day3')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            is_timeseries: false,
                            dataType: 3,
                            format: '万元',
                            values: [{value: {d: 10000000000000000}}],
                        }],
                    },
                })
            else if (id === 'week')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeSeries: true,
                            dataType: 3,
                            format: '万元',
                            values: new Array(100).fill(1).map((_, i) => {
                                const weekMs = 7 * 24 * 60 * 60 * 1000
                                return {
                                    value: {d: i},
                                    date: new Date(new Date('2021-08-27').getTime() + weekMs * i).getTime(),
                                }
                            }),
                        }],
                    },
                })
            else if (id === 'month')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeSeries: true,
                            dataType: 3,
                            format: '万元',
                            values: new Array(100).fill(1).map((_, i) => {
                                const base = new Date('2010-03-20')
                                return {
                                    value: {d: i},
                                    date: new Date(base.setMonth(base.getMonth() + i, 1) - 24 * 60 * 60 * 1000).getTime(),
                                }
                            }),
                        }],
                    },
                })
            else if (id === 'quarter')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeSeries: true,
                            dataType: 3,
                            format: '万元',
                            values: new Array(100).fill(1).map((_, i) => {
                                const base = new Date('2010-03-31')
                                base.setMonth(base.getMonth() + 3 * i + 1, 1)
                                const t = base.getTime() - 24 * 60 * 60 * 1000
                                return {
                                    value: {d: i},
                                    date: new Date(t).getTime(),
                                }
                            }),
                        }],
                    },
                })
            else if (id === 'year')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeSeries: true,
                            dataType: 3,
                            format: '万元',
                            values: new Array(100).fill(1).map((_, i) => {
                                return {
                                    value: {d: i},
                                    date: new Date(`${i + 2000}-12-31`).getTime(),
                                }
                            }),
                        }],
                    },
                })
            else if (id === 'text day2')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeseries: false,
                            dataType: 2,
                            values: [],
                        }],
                    },
                })
            else if (id === 'text day1')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeseries: true,
                            dataType: 2,
                            values: [],
                        }],
                    },
                })
            else if (id === 'text day')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeSeries: true,
                            dataType: 2,
                            values: genDates('2020-01-01', 100).map((time, i) => {
                                return {
                                    value: {s: i.toString().repeat(10000)},
                                    date: time,
                                }
                            }),
                        }],
                    },
                })
            else if (id === 'text week')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            is_timeseries: true,
                            dataType: 2,
                            values: new Array(100).fill(1).map((_, i) => {
                                const weekMs = 7 * 24 * 60 * 60 * 1000
                                return {
                                    value: {s: i.toString()},
                                    date: new Date(new Date('2021-08-27').getTime() + weekMs * i).getTime(),
                                }
                            }),
                        }],
                    },
                })
            else if (id === 'text month')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeSeries: true,
                            dataType: 2,
                            format: '万元',
                            values: new Array(100).fill(1).map((_, i) => {
                                const base = new Date('2010-03-20')
                                return {
                                    value: {s: i.toString()},
                                    date: new Date(base.setMonth(base.getMonth() + i, 1) - 24 * 60 * 60 * 1000).getTime(),
                                }
                            }),
                        }],
                    },
                })
            else if (id === 'text quarter')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeSeries: true,
                            dataType: 2,
                            values: new Array(100).fill(1).map((_, i) => {
                                const base = new Date('2010-03-31')
                                base.setMonth(base.getMonth() + 3 * i + 1, 1)
                                const t = base.getTime() - 24 * 60 * 60 * 1000
                                return {
                                    value: {s: i.toString()},
                                    date: new Date(t).getTime(),
                                }
                            }),
                        }],
                    },
                })
            else if (id === 'text year')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeSeries: true,
                            dataType: 2,
                            values: new Array(100).fill(1).map((_, i) => {
                                return {
                                    value: {s: i.toString()},
                                    date: new Date(`${i + 2000}-12-31`).getTime(),
                                }
                            }),
                        }],
                    },
                })
            else if (!isTimeSeries && id === 'text 2')
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeSeries: false,
                            dataType: 2,
                            format: '万元',
                            value: [{
                                value: {s: 123123123123},
                            }],
                        }],
                    },
                })
            else if (!isTimeSeries)
                res.json({
                    status: 'ok',
                    data: {
                        projectId: '1',
                        value: [{
                            id: '1',
                            name: 'indicator name',
                            isTimeSeries: false,
                            dataType: 3,
                            format: '万元',
                            value: [{
                                value: {d: 123123123123},
                            }],
                        }],
                    },
                })
            else
                next()
        }
    } else
        next()
})


const rewriter = jsonServer.rewriter(
    {
        '/saas/v1/ping/check': '/check',
        '/saas/v1/user': '/user',
        '/api/library/v1/report/info?id=1': '/reportInfo',
        '/saas/v1/auth/login': '/login',
        '/v1/wps/wpsSaasUrl?fileId=1&fileType=FILE_TYPE_REPORT_TEMPLATE&tokenType=1&wpsType=w': '/wpsUrl',
        '/v1/wps/wpsSaasUrl?fileId=1&fileType=FILE_TYPE_REPORT&tokenType=1&wpsType=w': '/wpsUrl',
        '/api/library/v1/data/dataList\\?type=DATA_LIST_TYPE_NUMBER\\&research_id=1': '/dataList',
        '/api/library/v1/data/dataList\\?type=DATA_LIST_TYPE_TEXT\\&research_id=1': '/dataListText',
        '/v1/data/dataSeriesValue': '/seriesValue',
        '/api/library/v1/template/info?id=1': '/templateInfo',
        '/v1/data/placeholder': '/placeholder',
        '/v1/classifications': '/classifications',
        '/v1/reportTypes': '/reportTypes',
        '/v1/reportTags': '/reportTags',
    }
)
server.use(rewriter)

const db = jsonServer.router('./db.json')
server.use(db)

const port = 3000
server.listen(port, () => {
    console.log(`JSON Server is running in localhost:${port}`)
})

const ONE_DAY = 1000 * 60 * 60 * 24
function genDates(start, count) {
    const startTime = new Date(start).getTime()
    const result = [startTime]
    for (let i = 0; i < count; i++) {
        const d = startTime + ONE_DAY * i
        result.push(new Date(d).getTime())
    }
    return result
}
