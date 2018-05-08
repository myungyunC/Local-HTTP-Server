/*
    - How to create HTTP Server using Node.js 
    - How to do HTTP GET using pure Node.js
    - How to do HTTP POST using pure Node.js 
    - How to develop web applications using pure Node.js 
    - How to use StringBuilder in Node.js 
    - How to use QueryString parser in Node.js 
    - How to send HTTP status codes in Node.js
*/

var http = require("http"); //already part of module default installation
                        // (node js) can be used straight away
var qs = require("querystring"); //node.js default provides module querystring to evalute querystring
var StringBuilder = require("stringbuilder");
var port = 9000;

function getHome(req, resp) {
    resp.writeHead(200, {"Content-Type":"text/html"});
    //hyperlink with the <a></a> 
    //as we do not hav ea page, we need to mimic a page for /calc
    //the hyperlink turns localhost:9000  -> localhost:9000/calc ilyy
    resp.write("<html><head><title>Sample HomePage</title><head><body>Want to see interesting facts of two numbers? Click <a href = '/calc'>here</a></body></html>");
    resp.end();
}

function get404(req, resp) {
    resp.writeHead(404, "Resource Not Found", {"Content-Type":"text/html"});
    //hyperlink with the <a></a> 
    //as we do not hav ea page, we need to mimic a page for /calc
    //the hyperlink turns localhost:9000  -> localhost:9000/calc
    resp.write("<html><head><title>404</title><head><body>404: Resource not found. Go to <a href = '/'>home</a></body></html>");
    resp.end();
}
 
function get405(req, resp) {
    resp.writeHead(405, "Method Not Supported", {"Content-Type":"text/html"});
    //hyperlink with the <a></a> 
    //as we do not hav ea page, we need to mimic a page for /calc
    //the hyperlink turns localhost:9000  -> localhost:9000/calc
    resp.write("<html><head><title>405</title><head><body>405: Method not supported. Go to <a href = '/'>home</a></body></html>");
    resp.end();
}

function leastCommonMultiple(min, max) {
    function range(min, max) {
        var arr = [];
        for (var i = min; i <= max; i++) {
            arr.push(i);
        }
        return arr;
    }

    function gcd(a, b) {
        return !b ? a : gcd(b, a % b);
    }

    function lcm(a, b) {
        return (a * b) / gcd(a, b);   
    }

    var multiple = min;
    range(min, max).forEach(function(n) {
        multiple = lcm(multiple, n);
    });

    return multiple;
}

function greatestCommonFactor(a,b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b > a) {var temp = a; a = b; b = temp;}
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
}

function getCalcWebpage(req, resp, data) {
    var sb = new StringBuilder({ newline: "\r\n"});
    //value should be empty in get request
    //value needs to be filled in for a post request

    sb.appendLine("<html>");
    sb.appendLine("<body>");
    sb.appendLine("    <form method='post'>"); //if 'submit' is clicked, then post, not get
    sb.appendLine("        <table>"); //4 table rows <
    sb.appendLine("            <tr>");
    sb.appendLine("                <td>Enter First Number:</td>");

    //could've also used data.method

    if (data && data.txtFirstNo) {
        sb.appendLine("                <td><input type='text' id='txtFirstNo' name='txtFirstNo' value='{0}'/></td>", data.txtFirstNo);
    }
    else {
        sb.appendLine("                <td><input type='text' id='txtFirstNo' name='txtFirstNo' value=''/></td>");
    }
    sb.appendLine("            </tr>");
    sb.appendLine("                <td>Enter Second Number:</td>");

    if (data && data.txtSecondNo) {
        sb.appendLine("                <td><input type='text' id='txtSecondNo' name='txtSecondNo' value='{0}'/></td>", data.txtSecondNo);
    }
    else {
        sb.appendLine("                <td><input type='text' id='txtSecondNo' name='txtSecondNo' value=''/></td>");
    } 
    sb.appendLine("            <tr>");
    sb.appendLine("                <td><input type='submit' value='Calculate'/></td>");
    sb.appendLine("            </tr>"); //submit gets completed

    if (data && data.txtFirstNo && data.txtFirstNo) {
        var lcm = leastCommonMultiple(parseInt(data.txtFirstNo), parseInt(data.txtSecondNo));
        var gcf = greatestCommonFactor(parseInt(data.txtFirstNo), parseInt(data.txtSecondNo));
        
        var one = parseFloat(data.txtFirstNo);
        var two = parseFloat(data.txtSecondNo);
        var sum = one + two;
        var difference = one - two;
        var product = one * two;
        var quotient = one / two;


        sb.appendLine("            <tr>");
        sb.appendLine("                <td>Least Common Multiple = {0}</td>", lcm);
        sb.appendLine("            </tr>");

        sb.appendLine("            <tr>");
        sb.appendLine("                <td>Greatest Common Factor = {0}</td>", gcf);
        sb.appendLine("            </tr>");

        sb.appendLine("            <tr>");
        sb.appendLine("                <td>Sum = {0}</td>", sum);
        sb.appendLine("            </tr>");

        sb.appendLine("            <tr>");
        sb.appendLine("                <td>Difference = {0}</td>", difference);
        sb.appendLine("            </tr>");

        sb.appendLine("            <tr>");
        sb.appendLine("                <td>Product = {0}</td>", product);
        sb.appendLine("            </tr>");

        sb.appendLine("            <tr>");
        sb.appendLine("                <td>Quotient = {0}</td>", quotient);
        sb.appendLine("            </tr>");

        //sum only gets displayed if data is being requested and processed
    }

    sb.appendLine("        </table>");
    sb.appendLine("    </form>");
    sb.appendLine("</body");
    sb.appendLine("</html>");

    //string builder is super efficient. use frameworks like express or react!

    //now that StringBuilder created string, got to send to 'resp'
    //once stringbuilder is done processing, entire string is result
    sb.build(function (err, result) { //if error exists from building, will throw
        resp.write(result);
        resp.end();
    });
}


function getCalcForm(req, resp, formData) {
    resp.writeHead(200, {"Content-Type": "text/html"});
    getCalcWebpage(req, resp, formData);
}

/*
    this is the method which accesses a callback function
    that gets executed for each and every request. 
    - request listener
    This is the function that will be executed for each
    and every request received from the client (browser is client)
    for any kind of request from browser to this particular
    applciation will always have this function executed

    must listen to a portnumber

    tl;dr
     - We developed a node.js http server application which 
     listens to port number 9000, for each and every request which
     essentially comes through the http, this function will be 
     executed.

    two parameters:
     - available request information -> req
     - whatever we want to respond to client(browser) -> resp

     these two are auto created by node.js framework, made available
     to function, and created for each and every request

     the req parameter is merely the incoming message object
      

*/
http.createServer(function (req, resp) {
    /*
        first thing: let browser know that request is successfully
            being processed and being responded
        thus header response with status code
            404 = not found
            200 = accessed
        
        will send html document back to client for every request
    */

    //different browsers request diff stuff. firefox doesnt req favicon.ico (icon in tab)
    console.log(req.url);

    //gonna use GET method, returns string "get/delete/post/put"
    switch (req.method) {
        case "GET": 
            if (req.url === "/") { //slash refers to the homepage, could've used a switch
               getHome(req, resp);
            }
            //if not root
            else if (req.url === "/calc") {
                getCalcWebpage(req, resp); //fresh request with no data!
            }
            //if not home or /calc, so some junk like /aaabbcdij, then error mssg!
            else {
                get404(req, resp);
            }
            break;
        case "POST":
            if (req.url === "/calc") {
                var reqBody = '';
                //in progress: when data is sensed, this fucntion is executed
                //this function gets executed for each chunk of data server is executing
                req.on('data', function(data) {
                    reqBody += data; //adds received data to reqBody
                    if (reqBody.length > 1e7)  {//10M
                        //413 is status code for too much data
                        resp.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html' });
                        resp.write("<html><head><title>405</title><head><body>413: Too much information for the server to handle.. Go to <a href = '/'>home</a></body></html>");
                        resp.end();
                    }
                });
                //at end, done receiving:
                req.on('end',function(data) {
                    //formdata contains all info necessary to calculate sum
                    //qs is querystring
                    var formData = qs.parse(reqBody);
                    getCalcForm(req, resp, formData);
                    //during the post, we are calculating the form based on data
                    //post request we have data, unlike before
                    //both requests go in same method
                });
            }
            else {
                get404(req, resp);
            }
            break;
        default:
            get405(req, resp);
            break;
    }

    // resp.writeHead(200, {"Content-Type" : "text/html"});
    // resp.write("<html><body>I love <strong><i>Yvette Yoon!!!</i></strong></body></html>"); 

    // //can add as many writes as possible
    // //will be sent to client

    
} ).listen(port);
