const fResponse = require("../common/fResponse");
const actionCardTemplate = require("../common/ActionCardTemplate");

const getActionsCard = (result, fnCallback) => {
    var fResp = new FunctionResponse("getActionsCard", [result, fnCallback]);

    logger.info("getActionsCard called" + result.req.body.type);

    var paramOfActionCard = result.req.body;
    var typeOfDoc = paramOfActionCard.type;

    switch (typeOfDoc) {
        case "invoice":
            // fResp.setData(actionCardTemplate.eArsiv);
            // fnCallback(fResp);
            actionCardTemplate.getActionTemplateByDocType(typeOfDoc, fResp => {
                if (fResp.err !== undefined) fResp.setErr(fResp.err)
                else fResp.setData(fResp.data);
                fnCallback(fResp)
            })
            break;
        case "cce":
            // fResp.setData(actionCardTemplate.cce);
            // fnCallback(fResp);
            actionCardTemplate.getActionTemplateByDocType(typeOfDoc, fResp => {
                if (fResp.err !== undefined) fResp.setErr(fResp.err)
                else fResp.setData(fResp.data);
                fnCallback(fResp)
            })
            break;
        case "policy":
            // fResp.setData(actionCardTemplate.policy);
            // fnCallback(fResp);
            actionCardTemplate.getActionTemplateByDocType(typeOfDoc, fResp => {
                if (fResp.err !== undefined) fResp.setErr(fResp.err)
                else fResp.setData(fResp.data);
                fnCallback(fResp)
            })
            break;
        case "flight_ticket":
            // fResp.setData(actionCardTemplate.flight_ticket);
            // fnCallback(fResp);
            actionCardTemplate.getActionTemplateByDocType(typeOfDoc, fResp => {
                if (fResp.err !== undefined) fResp.setErr(fResp.err)
                else fResp.setData(fResp.data);
                fnCallback(fResp)
            })
            break;
        case "event_ticket":
            // fResp.setData(actionCardTemplate.event_ticket);
            // fnCallback(fResp);
            actionCardTemplate.getActionTemplateByDocType(typeOfDoc, fResp => {
                if (fResp.err !== undefined) fResp.setErr(fResp.err)
                else fResp.setData(fResp.data);
                fnCallback(fResp)
            })
            break;
        default:
            fResp.setErr("Unexpected Type");
            fnCallback(fResp);
    }
}


//================================================================
module.exports = {
    getActionsCard
}