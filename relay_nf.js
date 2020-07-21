module.exports = function(RED) {

    "use strict";
    var mapeamentoNode;

    function relay_nfNode(config) {

        RED.nodes.createNode(this, config);
        this.mapeamento = config.mapeamento
        this.relay_number = config.relay_number

        var node = this
        var valor_nf = config.relay_nf_value

        mapeamentoNode = RED.nodes.getNode(this.mapeamento)



        node.on('input', function(msg, send, done) {

            // substitua a variavel msg pela a informação desejada a ser passada via serial
            var globalContext = node.context().global;
            var exportMode = globalContext.get("exportMode");
            var currentMode = globalContext.get("currentMode");
            var command = {
                type: "relay_modular_V1_0",
                slot: parseInt(mapeamentoNode.slot),
                compare: {},
                method: "set_status_NF",
                relay_number: parseInt(node.relay_number),
                relay_value: valor_nf === "true" ? true : false,
                get_output: {},
            }
            var file = globalContext.get("exportFile")
            var slot = globalContext.get("slot");
            if(!(slot === "begin" || slot === "end")){
                if(currentMode == "test"){
                    file.slots[slot].jig_test.push(command);
                }
                else{
                    file.slots[slot].jig_error.push(command);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command);
                    // file.begin.push(command);
                }
                else{
                    file.slots[3].jig_test.push(command);
                    // file.end.push(command);
                }
            }
            globalContext.set("exportFile", file);
            console.log(command)
             // node.status({fill:"green", shape:"dot", text:"done"}); // seta o status pra waiting

            send(msg)

        });

        // var nodeDaVariavel = config.NodeDaVariavel

    }

    // nome do modulo
    RED.nodes.registerType("relay_nf", relay_nfNode);

    // RED.httpAdmin.get("/statusNF", function(req, res) {
    //     console.log(mapeamentoNode)
    //     if (mapeamentoNode) {
    //         res.json([
    //             { value: mapeamentoNode.valuePort9, label: "NF9 | CM9 - " + mapeamentoNode.labelPort9, hasValue: false },
    //             { value: mapeamentoNode.valuePort10, label: "NF10 | CM10 - " + mapeamentoNode.labelPort10, hasValue: false },
    //             { value: mapeamentoNode.valuePort11, label: "NF11 | CM11 - " + mapeamentoNode.labelPort11, hasValue: false },
    //             { value: mapeamentoNode.valuePort12, label: "NF12 | CM12 - " + mapeamentoNode.labelPort12, hasValue: false },
    //             { value: mapeamentoNode.valuePort13, label: "NF13 | CM13 - " + mapeamentoNode.labelPort13, hasValue: false },
    //             { value: mapeamentoNode.valuePort14, label: "NF14 | CM14 - " + mapeamentoNode.labelPort14, hasValue: false },
    //             { value: mapeamentoNode.valuePort15, label: "NF15 | CM15 - " + mapeamentoNode.labelPort15, hasValue: false },
    //             { value: mapeamentoNode.valuePort16, label: "NF16 | CM16 - " + mapeamentoNode.labelPort16, hasValue: false },
    //         ])
    //     } else {
    //         res.json([
    //             { label: "NF9 | CM9", value: "0", hasValue: false },
    //             { label: "NF10 | CM10", value: "1", hasValue: false },
    //             { label: "NF11 | CM11", value: "2", hasValue: false },
    //             { label: "NF12 | CM12", value: "3", hasValue: false },
    //             { label: "NF13 | CM13", value: "5", hasValue: false },
    //             { label: "NF14 | CM14", value: "6", hasValue: false },
    //             { label: "NF15 | CM15", value: "7", hasValue: false },
    //             { label: "NF16 | CM16", value: "8", hasValue: false },
    //         ])
    //     }
    // });
}