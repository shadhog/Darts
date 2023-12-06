$( document ).ready(function() {

	var dartBoard = $('.dart-board');
	var container = $('.container');
	//var dart = $('#dart');
	var arrows = $('#arrows');
	
	var $mouseX = 0, $mouseY = 0;
	var $xp = 0, $yp =0;
	var dw = 0, swAdd = 0.6, miss = 0;
	var opacityEffect;
	var arrow = $('<img class="dart" draggable="false" src="images/dart.png">');
	
	// GET MWK
	var mkw = 2;
	//var mkw = getUrlParameter('mkw');
	
	// CHECK FOR MKW
	if( typeof mkw !== 'undefined') {
		var lines = $('.test');
		var radius = dartBoard.width();
		lines.each(function(index) {
			console.log('> index: ' + index + '> radius: ' + (radius - (index * $(this).height())))
			new CircleType($(this)[0]).radius((radius - (index * $(this).height()))/2);
		});
		
		arrow.appendTo(arrows);
		dart = arrow;
		
		var $loop = setInterval(ArrowMovement, 30);
	}
	// WHAT TO SHOW INSTEAD OF GAME IF NO MKW
	else {
		$('body').html('NO MKW!');
	}

	$(document).mousemove(function(e){
		$mouseX = e.pageX - 14;
		$mouseY = e.pageY - 28;    
	});
	
	
	function ArrowMovement() {
		dw = dw + swAdd;
		if(dw > 10) {
			swAdd *= -1;
			dw = 9.9;
			miss = Math.floor((Math.random() * 10) - 5);
		}
		else if(dw < 0) {
			swAdd *= -1;
			dw = 0.1;
			miss = Math.floor((Math.random() * 10) - 5);
		}
		//console.log(dw);
		// change 12 to alter damping higher is slower
		$xp += (($mouseX - $xp)/10) + dw + miss;
		$yp += (($mouseY - $yp)/10) + dw + miss*1.5;
		dart.css({left:$xp +'px', top:$yp +'px'});  
	}
	
	
	container.on('mouseup',function() {
		console.log('a');
		clearInterval($loop);
		
		tar = dartBoard.find('li').eq(mkw-1);
		tarX = tar.offset().left + tar.width()/2;
		tarY = tar.offset().top + tar.height()/2;

		if($xp < tarX) {
			opacityEffect = 0;
			posEffect = ($xp-400);
			
			setTimeout(function () {
				dart.remove();
				var newArrow = $('<img class="dart" draggable="false" src="images/dart.png">');
				newArrow.appendTo(arrows);
				dart = newArrow;
				$loop = setInterval(ArrowMovement, 30);
			}, 500);
		}
		else {
			opacityEffect = 1;
			posEffect = tarX;
			container.off('mouseup');
			setTimeout(function() { 
				InitializeConfetti();
				setTimeout(function() { 
					DeactivateConfetti();
				}, 1500);
			}, 500);
		}
		
		var bezier_params = {
			start: {
			  x: $xp,
			  y: $yp,
			  angle: 50
			},
			end: {
			  x: posEffect,
			  y: tarY,
			  angle: -50,
			  length: 0.5
			}
		}
		dart.animate({path : new $.path.bezier(bezier_params), width: '60px', opacity: opacityEffect});
		
		
	});
	
	// FUNCTAION TO GET PARAMETERS FROM ADDRESS
	function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};





/*  This is the Confetti code  */

    // globals
    var canvas;
    var ctx;
    var W;
    var H;
    var mp = 150; //max particles
    var particles = [];
    var angle = 0;
    var tiltAngle = 0;
    var confettiActive = true;
    var animationComplete = true;
    var deactivationTimerHandler;
    var reactivationTimerHandler;
    var animationHandler;

    // objects

    var particleColors = {
        colorOptions: ["DodgerBlue", "OliveDrab", "Gold", "pink", "SlateBlue", "lightblue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"],
        colorIndex: 0,
        colorIncrementer: 0,
        colorThreshold: 10,
        getColor: function () {
            if (this.colorIncrementer >= 10) {
                this.colorIncrementer = 0;
                this.colorIndex++;
                if (this.colorIndex >= this.colorOptions.length) {
                    this.colorIndex = 0;
                }
            }
            this.colorIncrementer++;
            return this.colorOptions[this.colorIndex];
        }
    }

    function confettiParticle(color) {
        this.x = Math.random() * W; // x-coordinate
        this.y = (Math.random() * H) - H; //y-coordinate
        this.r = RandomFromTo(10, 30); //radius;
        this.d = (Math.random() * mp) + 10; //density;
        this.color = color;
        this.tilt = Math.floor(Math.random() * 10) - 10;
        this.tiltAngleIncremental = (Math.random() * 0.07) + .05;
        this.tiltAngle = 0;

        this.draw = function () {
            ctx.beginPath();
            ctx.lineWidth = this.r / 2;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.x + this.tilt + (this.r / 4), this.y);
            ctx.lineTo(this.x + this.tilt, this.y + this.tilt + (this.r / 4));
            return ctx.stroke();
        }
    }

    $(document).ready(function () {
        SetGlobals();
        //InitializeButton();
        //InitializeConfetti();

        $(window).resize(function () {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
        });

    });

    /*function InitializeButton() {
        $('#stopButton').click(DeactivateConfetti);
        $('#startButton').click(RestartConfetti);
    }*/

    function SetGlobals() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    }

    function InitializeConfetti() {
        particles = [];
        animationComplete = false;
        for (var i = 0; i < mp; i++) {
            var particleColor = particleColors.getColor();
            particles.push(new confettiParticle(particleColor));
        }
        StartConfetti();
    }

    function Draw() {
        ctx.clearRect(0, 0, W, H);
        var results = [];
        for (var i = 0; i < mp; i++) {
            (function (j) {
                results.push(particles[j].draw());
            })(i);
        }
        Update();

        return results;
    }

    function RandomFromTo(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }


    function Update() {
        var remainingFlakes = 0;
        var particle;
        angle += 0.01;
        tiltAngle += 0.1;

        for (var i = 0; i < mp; i++) {
            particle = particles[i];
            if (animationComplete) return;

            if (!confettiActive && particle.y < -15) {
                particle.y = H + 100;
                continue;
            }

            stepParticle(particle, i);

            if (particle.y <= H) {
                remainingFlakes++;
            }
            CheckForReposition(particle, i);
        }

        if (remainingFlakes === 0) {
            StopConfetti();
        }
    }

    function CheckForReposition(particle, index) {
        if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
            if (index % 5 > 0 || index % 2 == 0) //66.67% of the flakes
            {
                repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 20);
            } else {
                if (Math.sin(angle) > 0) {
                    //Enter from the left
                    repositionParticle(particle, -20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
                } else {
                    //Enter from the right
                    repositionParticle(particle, W + 20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
                }
            }
        }
    }
    function stepParticle(particle, particleIndex) {
        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
        particle.x += Math.sin(angle);
        particle.tilt = (Math.sin(particle.tiltAngle - (particleIndex / 3))) * 15;
    }

    function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
        particle.x = xCoordinate;
        particle.y = yCoordinate;
        particle.tilt = tilt;
    }

    function StartConfetti() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        (function animloop() {
            if (animationComplete) return null;
            animationHandler = requestAnimFrame(animloop);
            return Draw();
        })();
    }

    function ClearTimers() {
        clearTimeout(reactivationTimerHandler);
        clearTimeout(animationHandler);
    }

    function DeactivateConfetti() {
        confettiActive = false;
        ClearTimers();
    }

    function StopConfetti() {
        animationComplete = true;
        if (ctx == undefined) return;
        ctx.clearRect(0, 0, W, H);
    }

    function RestartConfetti() {
        ClearTimers();
        StopConfetti();
        reactivationTimerHandler = setTimeout(function () {
            confettiActive = true;
            animationComplete = false;
            InitializeConfetti();
        }, 100);

    }

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame || 
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    })();
});
