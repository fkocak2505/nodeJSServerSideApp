//Imports Lib
const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require("request");
const config = require('dotenv').config();


const multer = require('multer');
const upload = multer({ dest: "upload/" });
const type = upload.single('recfile');

const userController = require("./api/UserController");
const docController = require("./api/DocController");
const accountController = require("./api/AccountController");
const sampleController = require("./api/SampleController");
const slackIntegration = require("./api/SlackIntegrationController");
const actionsCard = require("./api/ActionsCardController");
const actionsLog = require("./api/ActionLogController");
const engineStatusController = require("./api/EngineStatusController");
const util = require("./util/util");


//API
const API_VERSION = "0.0.1";


app.use(cors());
// Enable the use of request body parsing middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



//===============================================================================
// SAMPLE API For Private And Public
//================================================================================
app.get('/api/public', (req, res) => {
    res.json({
        message: "Hello I am Golgi Server. API:" + API_VERSION
    });
});


//===============================================================================
// USER
//================================================================================

//================================================================================
app.post('/api/login', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    userController.login(result);
});

//================================================================================
app.post('/api/register', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    userController.register(result);
});

//================================================================================
app.get('/api/allUser', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    userController.allUser(result);
});

//================================================================================
app.post('/api/user', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    userController.getUser(result);
});

//================================================================================
app.post('/api/updateUser', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    userController.updateUser(result);
});

//================================================================================
app.post('/api/sendEmail', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    userController.sendEmail4ForgetPassword(result);
});



//===============================================================================
// SLACK INTEGRATION
//================================================================================
app.get('/api/handleSlackAuthorization', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    slackIntegration.handleSlackAuthorization(result);
});
//================================================================================



//===============================================================================
// ACCOUNT
//================================================================================


//================================================================================
app.post('/api/getAccount', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    accountController.getAccount(result);
});

//================================================================================
app.post('/api/updateAccount', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    accountController.updateAccount(result);
});


//================================================================================
app.post('/api/clearAccount', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    accountController.clearAccount(result);
});



//================================================================================
app.post('/api/getAccountDocs', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    accountController.getAccountDocs(result);
});

//================================================================================
app.post('/api/getAccountNotifications', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    accountController.getAccountNotifications(result);
});

//================================================================================
app.post('/api/actionRules', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    accountController.getActionRulesByUsers(result);
});

//================================================================================
//  SAMPLE            
//================================================================================

//================================================================================
app.get('/api/getSamples', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    sampleController.getSamples(result);
});

//================================================================================
app.post('/api/copySample', (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    sampleController.copySample2UploadsFolder(result);
});


//================================================================================
//  DOC            
//================================================================================

app.post("/api/uploadDoc", type, (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    docController.uploadDoc(result);
});


//================================================================================
//  ACTIONCARD            
//================================================================================

app.post("/api/actionsCards", type, (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    actionsCard.getActionsCard(result);
});

//================================================================================
//  ACTION LOG            
//================================================================================

app.get("/api/actionLogs", type, (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    actionsLog.getAllActionLog(result);
});

//================================================================================
//  GOLGI ENGINE STATUS           
//================================================================================

app.get("/api/engineStatus", type, (req, res) => {
    var result = { data: { data: 0 }, req: req, res: res };
    engineStatusController.getEngineStatus(result);
});


var port = process.env.PORT || 3010
app.listen(port);
logger.info('Listening on http://localhost:' + port);