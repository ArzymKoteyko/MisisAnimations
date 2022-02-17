var express = require('express');
var app=express();
var path = require('path');

app.use(express.static(path.join(__dirname, '/source/static')));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '//html');
app.set('view engine', 'html');
var http = require('http').Server(app);
var server = require('socket.io')(http);
var port=89;

var click_counter = 0;//Initial counter value

app.get('/', function(req, res) {

        res.sendFile(__dirname + '/source/templates/index.html');
    });


server.on('connection', function(socket)
{
    console.log('a user connected');

    //on user connected sends the current click count
    socket.emit('click_count',click_counter);

    //when user click the button
    socket.on('clicked',function(){
        click_counter +=1;//increments global click count
        console.log('click received!', click_counter);
        server.emit('click_count', click_counter);//send to all users new counter value
    });

});

//starting server
http.listen(port, function()
{
    console.log('listening on port:'+port);
});
