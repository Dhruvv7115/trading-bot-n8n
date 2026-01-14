import express from "express";
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);

//routes

app.post("/signup", (req, res) => {});
app.post("/signin", (req, res) => {});
app.post("/workflow", (req, res) => {});
app.patch("/workflow", (req, res) => {});
app.get("/workflow/:workflowId", (req, res) => {});
app.get("/workflow/executions/:workflowId", (req, res) => {});
app.post("/credentials", (req, res) => {});
app.get("/credentials", (req, res) => {});
app.get("/nodes", (req, res) => {});

app.listen();
