export const DB =
{
    SQL:
    {
        type: "mysql",
        port: 3306,
        host: process.env.SQL_HOST,
        username: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DATABASE,
        synchronize: true,
        logging: false,
        entities: []
    }
}