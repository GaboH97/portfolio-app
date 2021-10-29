import bodyParser from "body-parser";
import express, { Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "./dist/routes";
const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "dist/swagger.json",
        },
    })
);

app.get('/', (req, res) => {
    return res.send({ hello: 'world' })
});

app.listen(3000, () => {
    console.log("Server is running on port", 3000);
});

// app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
//     return res.send(
//         swaggerUi.generateHTML(await import("../dist/swagger.json"))
//     );
// });

RegisterRoutes(app);

app.use(function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
): ExResponse | void {
    if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }

    next();
});

export default app;