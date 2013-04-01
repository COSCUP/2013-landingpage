"use strict";

(function ($) {
  // http://jsfromhell.com/array/shuffle
  Array.prototype.shuffle = function () { //v1.0
    for(var j, x, i = this.length; i; 
      j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
  };

  $.fn.openWall = function (options) {
    var picNameList = [];
    var settings = {
      imageDir: 'photo/',
      totalPicNumber: 34,
      picBase: 50,
      defaultImage: 'images/default.jpg',
      mobile: false,
      picMask: {
        o: [
          [0, 0, 0, 0, 0, 0],
          [0, 0, 1, 1, 0, 0],
          [0, 1, 0, 0, 1, 0],
          [0, 1, 0, 0, 1, 0],
          [0, 1, 0, 0, 1, 0],
          [0, 0, 1, 1, 0, 0]
        ],
        p: [
          [0, 0, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 0],
          [0, 1, 0, 0, 1, 0],
          [0, 1, 1, 1, 1, 0],
          [0, 1, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0]
        ],
        e: [
          [0, 0, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 0],
          [0, 1, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 0],
          [0, 1, 0, 0, 0, 0],
          [0, 1, 1, 1, 1, 0]
        ],
        n: [
          [0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 1, 0],
          [0, 1, 1, 0, 1, 0],
          [0, 1, 0, 1, 1, 0],
          [0, 1, 0, 0, 1, 0],
          [0, 1, 0, 0, 1, 0]
        ]
      },
      borderMask: {
        upper: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], 
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
        ],
        lower: [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], 
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
        ]
      }

    };
    if (options) {
      $.extend(settings, options);
    }

    function getPicList() {
      for (var i = 0; i < settings.totalPicNumber; ++i) {
        picNameList[i] = i;
      }
      return picNameList;
    }

    function layoutPic(target) {
      var useDefault = Math.ceil(settings.totalPicNumber/settings.picBase);
      var letterIndex = 0;
      for(var letter in settings.picMask) {
        var defaultImg = (useDefault > letterIndex)? null : settings.defaultImage;
        var letterMask = settings.picMask[letter];
        var div = document.createElement('div');
        div.classList.add('letterBlock');
        var offset = letterIndex * letterMask.length * letterMask[0].length;
        fillPic(div, letterMask, offset, defaultImg);
        $(target).append(div);
        letterIndex++;
      }
    }

    function layoutBorder(target) {
      var upperBorder = document.createElement('div');
      upperBorder.id = 'upper-border';
      var lowerBorder = document.createElement('div');
      lowerBorder.id = 'lower-border';
      fillPic(upperBorder, settings.borderMask.upper, 0, null);
      $(target).prepend(upperBorder);
      fillPic(lowerBorder, settings.borderMask.lower, 10, null);
      $(target).append(lowerBorder);
    }

    function fillPic(div, mask, offset, defaultImg) {
      var rows = mask.length;
      var cols = mask[0].length;
      for (var i = 0; i < rows; ++i) {
        for (var j = 0; j < cols; ++j) {
          var img = document.createElement('img');
          var pos = Math.floor((i * cols + j) % settings.totalPicNumber);
          img.src = settings.imageDir + picNameList[pos] + '.jpg'; 
          img.classList.add('thumbnail');
          if (mask[i][j]) { 
            if (defaultImg) {
              img.src = defaultImg;
              img.classList.add('default');
            } else {
              img.classList.add('highlight');
            }
          }
          $(div).append(img);
        }
      }
    }
    return this.each(function() {
      getPicList().shuffle();
      layoutPic(this);
      if (!settings.mobile)
        layoutBorder(this);
      else {
        $('#callforphoto .title').click(function() {
          $('#callforphoto .content').toggle("slow");
        });
      }
    });
  }
})(jQuery);
