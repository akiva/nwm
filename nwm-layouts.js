
var layouts = {};

/**
 * Dwm's tiling a.k.a "Vertical Stack Tiling"
 *
 *  +----------+----------+ +----------+----------+
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  |          |          | |          +----------+
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  |          |          | |          |          |
 *  +---------------------+ +---------------------+
 *        2 windows               3 windows
 *
 *  +----------+----------+ +----------+----------+
 *  |          |          | |          |          |
 *  |          |          | |          +----------+
 *  |          +----------+ |          |          |
 *  |          |          | |          +----------+
 *  |          +----------+ |          |          |
 *  |          |          | |          +----------+
 *  |          |          | |          |          |
 *  +---------------------+ +---------------------+
 *        4 windows               5 windows
 */
layouts.tile = function(nwm) {
  // the way DWM does it is to reserve half the screen for the first screen,
  // then split the other half among the rest of the screens
  var windows = nwm.visible();
  var screen = nwm.screen;
  if(windows.length < 1) {
    return;
  }
  var firstId = windows.shift();
  if(windows.length == 0) {
    nwm.move(firstId, 0, 0);
    nwm.resize(firstId, screen.width, screen.height);
  } else {
    var halfWidth = Math.floor(screen.width / 2);
    var sliceHeight = Math.floor(screen.height / (windows.length) );
    nwm.move(firstId, 0, 0);
    nwm.resize(firstId, halfWidth, screen.height);
    windows.forEach(function(id, index) {
      nwm.move(id, halfWidth, index*sliceHeight);
      nwm.resize(id, halfWidth, sliceHeight);
    });
  }
};

/**
 * Monocle (a.k.a. fullscreen)
 *
 *  +---------------------+ +---------------------+
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  +---------------------+ +---------------------+
 *        2 windows               3 windows
 *
 *  +---------------------+ +---------------------+
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  +---------------------+ +---------------------+
 *        4 windows               5 windows
 */

layouts.monocle = function(nwm){
  var windows = nwm.visible();
  var screen = nwm.screen;
  if(windows.length < 1) {
    return;
  }
  var firstId = windows.shift();
  nwm.move(firstId, 0, 0);
  nwm.resize(firstId, screen.width, screen.height);
  windows.forEach(function(id, index) {
    nwm.hide(id);
  });
}

/**
 * Bottom Stack Tiling (a.k.a. wide)
 *
 *  +----------+----------+ +----------+----------+
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  +---------------------+ +---------------------+
 *  |                     | |          |          |
 *  |                     | |          |          |
 *  |                     | |          |          |
 *  +---------------------+ +---------------------+
 *        2 windows               3 windows
 *
 *  +---------------------+ +---------------------+
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  +------+-------+------+ +----+-----+-----+----+
 *  |      |       |      | |    |     |     |    |
 *  |      |       |      | |    |     |     |    |
 *  |      |       |      | |    |     |     |    |
 *  +------+-------+------+ +----+-----+-----+----+
 *        4 windows               5 windows
 */
layouts.wide = function(nwm) {
  // the way DWM does it is to reserve half the screen for the first screen,
  // then split the other half among the rest of the screens
  var windows = nwm.visible();
  var screen = nwm.screen;
  if(windows.length < 1) {
    return;
  }
  var firstId = windows.shift();
  if(windows.length == 0) {
    nwm.move(firstId, 0, 0);
    nwm.resize(firstId, screen.width, screen.height);
  } else {
    var halfHeight = Math.floor(screen.height / 2);
    var sliceWidth = Math.floor(screen.width / (windows.length) );
    nwm.move(firstId, 0, 0);
    nwm.resize(firstId, screen.width, halfHeight);
    windows.forEach(function(id, index) {
      nwm.move(id, index*sliceWidth, halfHeight);
      nwm.resize(id, sliceWidth, halfHeight);
    });
  }
};


/**
 * Grid (a.k.a fair)

    +----------+----------+ +----------+----------+
    |          |          | |          |          |
    |          |          | |          |          |
    |          |          | |          |          |
    |          |          | +----------+----------+
    |          |          | |                     |
    |          |          | |                     |
    |          |          | |                     |
    +---------------------+ +---------------------+
          2 windows               3 windows

    +----------+----------+ +------+-------+------+
    |          |          | |      |       |      |
    |          |          | |      |       |      |
    |          |          | |      |       |      |
    +----------+----------+ +------+---+---+------+
    |          |          | |          |          |
    |          |          | |          |          |
    |          |          | |          |          |
    +---------------------+ +---------------------+
          4 windows               5 windows
 */

layouts.grid = function(nwm) {
  var windows = nwm.visible();
  var screen = nwm.screen;
  if(windows.length < 1) {
    return;
  }
  var rows, cols;
  for(cols = 0; cols <= windows.length/2; cols++) {
    if(cols * cols >= windows.length) {
      break;
    }
  }
  rows = ((cols && (cols -1) * cols >= windows.length) ? cols - 1 : cols);
  console.log('rows, cols', rows, cols);
  // cells
  var cellHeight = screen.height / (rows ? rows : 1);
  var cellWidth = screen.width / (cols ? cols : 1);
  console.log('Cell dimensions', cellWidth, cellHeight);
  windows.forEach(function(id, index) {

    if(rows > 1 && index == (rows*cols) - cols 
       && (windows.length - index) <= ( windows.length) 
      ) {
      cellWidth = screen.width / (windows.length - index);
    }

    var newX = Math.floor(index % cols) * cellWidth;
    var newY = Math.floor(index / cols) * cellHeight;
    nwm.move(id, Math.floor(newX), Math.floor(newY));

    // adjust height/width of last row/col's windows
    var adjustHeight = ( (index >= cols * (rows -1) ) ?  screen.height - cellHeight * rows : 0 );
    var adjustWidth = 0;
    if(rows > 1 && index == windows.length-1 && (windows.length - index) < (windows.length % cols) ) {
      adjustWidth = screen.width - cellWidth * (windows.length % cols );     
    } else {
      adjustWidth = ( ((index + 1) % cols == 0 ) ? screen.width - cellWidth * cols : 0 );
    }
 
    nwm.resize(id, Math.floor(cellWidth+adjustWidth), Math.floor(cellHeight+adjustHeight) );
  });
};

module.exports = layouts;