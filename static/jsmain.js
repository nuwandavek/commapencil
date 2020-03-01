var canvas = document.getElementById('main-canvas');
var ctx = canvas.getContext('2d');
var currentSize = 10;
var curClass = 0;

var classes = config.classes

console.log(classes);

classes.forEach((col,i)=>{
    console.log(col,i);
    $( "#pencils" ).append( "<div data-class='pencil-"+col['id']+"' class='c-p-div'><p class='c-p-text'>"+col['name']+"</p><div class='color-pencil' style='background:"+col['color']+"'></div></div>");
});


$(".c-p-div").click((evt)=>{
    console.log($(evt.target).data("class"));
    curClass = parseInt($(evt.target).data("class").split('-')[1]);
})

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

ctx.fillStyle = '#fff';
ctx.fillRect(0,0,canvas.width, canvas.height);
// ON MOUSE DOWN

var isMouseDown = false;
var curPath = [];
var globalPaths = [];
var overlayImg = null;

function mousedown(canvas, evt) {
    isMouseDown=true;
    var currentPosition = getMousePos(canvas, evt);
    curPath = [[currentPosition.x, currentPosition.y]]
    ctx.moveTo(currentPosition.x, currentPosition.y)
    ctx.beginPath();
    ctx.lineWidth  = currentSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = classes[curClass].color;
    ctx.fillStyle = classes[curClass].color;

}

// ON MOUSE MOVE

function mousemove(canvas, evt) {

    if(isMouseDown){
        var currentPosition = getMousePos(canvas, evt);
        ctx.lineTo(currentPosition.x, currentPosition.y)
        ctx.stroke();
        curPath.push([currentPosition.x, currentPosition.y]);
    }
}

// ON MOUSE UP

function mouseup() {
    isMouseDown=false
    globalPaths.push({path:curPath,className:curClass,color:classes[curClass].color, size:currentSize});
    drawAllPaths();
}

function drawAllPaths(){
    ctx.clearRect(0, 0, canvas.width,canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    if (overlayImg!==null){
        ctx.drawImage(overlayImg,0,0);
    }
    globalPaths.forEach((pathObj)=>{
        var path = pathObj.path;
        var className = pathObj.className;
        var color = pathObj.color;
        var size = pathObj.size;
        ctx.beginPath()
        ctx.moveTo(path[0][0],path[0][1]);
        path.forEach((pt)=>{
            ctx.lineTo(pt[0],pt[1]);    
        })
        // ctx.closePath();
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.stroke();
        ctx.fill();
    })
    
}


canvas.addEventListener('mousedown', function() {mousedown(canvas, event);});
canvas.addEventListener('mousemove',function() {mousemove(canvas, event);});
canvas.addEventListener('mouseup',mouseup);


$('#undo').click(()=>{
    globalPaths.pop();
    drawAllPaths();
})


$("#download").click((evt)=>{
    drawAllPaths();
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
  link.download = img_name;
  link.href = image;
  link.click();
})

$("#load").click((evt)=>{
    overlayImg = new Image();
    overlayImg.src = '/static/data/segz/'+img_name;
    overlayImg.onload = drawAllPaths
    overlayImg.onerror = function(){
        overlayImg = null;
    }
})

$('#clear').click(()=>{
    overlayImg = null;
    globalPaths = [];
    drawAllPaths();
})

$(document).on('input', '#myRange', function() {
    // console.log($(this).val());
    currentSize = $(this).val();
    $(".color-pencil").each(function( index ) {
        $( this ).css({"width":currentSize,"height":currentSize,"border-radius":currentSize/2});
      });
});

$(document).on('input', '#myRangeOpacity', function() {

    $("#main-canvas").css({"opacity":$(this).val()/10});
});


$('#previous').click(()=>{
    window.location.href = '/?id='+(parseInt(img_id)-1)
})

$('#next').click(()=>{
    window.location.href = '/?id='+(parseInt(img_id)+1)
})



$('#go-to-button').click(()=>{
    var togoto = $('#go-to').val()
    window.location.href = '/?id='+togoto;
})
