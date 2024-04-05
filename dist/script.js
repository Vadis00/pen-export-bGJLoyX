angular
    .module('duellingApp', [])
    .controller('GameController',
        ['$scope', '$interval', '$timeout', '$window',

            function gameController($scope, $interval, $timeout, $window) {
                const shark = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/209305/shark.png';

                $scope.playSound = function(soundFileName) {
                    var sound = document.getElementById("gameSound");
                    sound.src = soundFileName;
                    sound.play();
                  };

                // Arrays with different texts for winning and losing
                $scope.winMessages = [
                    {
                        title: "Victory!",
                        description: "Congratulations! You have emerged victorious in this challenging battle. Your strategic brilliance has led you to triumph over your opponent. Well done!",
                        buttonText: "Start a new game"
                    },
                    {
                        title: "Excellent Performance!",
                        description: "Your skills have brought you to victory! With determination and perseverance, you have conquered all obstacles and claimed victory. Keep up the good work!",
                        buttonText: "Play again"
                    },
                    {
                        title: "Triumphant Win!",
                        description: "Hooray! You have achieved a resounding victory! Your efforts have paid off, and you stand as the champion. Celebrate your success and savor the moment!",
                        buttonText: "Begin a new challenge"
                    },
                    {
                        title: "Champion's Triumph!",
                        description: "You've done it! You've emerged as the ultimate victor! Through your skillful maneuvers and unwavering resolve, you've overcome all opposition. Let your triumph resound!",
                        buttonText: "Continue the journey"
                    },
                    {
                        title: "Glory Awaits!",
                        description: "Congratulations on your victory! Your unwavering determination and sharp intellect have led you to triumph. Bask in the glory of your success!",
                        buttonText: "Challenge anew"
                    },
                    {
                        title: "Masterful Victory!",
                        description: "Incredible! Your cunning strategy and impeccable execution have secured a glorious win. Revel in your triumph and prepare for future conquests!",
                        buttonText: "Start another game"
                    },
                    {
                        title: "Triumphant Conquest!",
                        description: "A triumph to be proud of! Your unwavering resolve and tactical brilliance have vanquished all foes. Let the world marvel at your victory!",
                        buttonText: "Begin anew"
                    },
                    {
                        title: "Victorious Champion!",
                        description: "You stand as the undeniable champion! With valor and skill, you have emerged triumphant. Let your victory be a beacon of inspiration to all!",
                        buttonText: "Start afresh"
                    },
                    {
                        title: "Unstoppable Success!",
                        description: "You've conquered all challenges and emerged victorious! Your unstoppable determination has led you to glory. Keep pushing forward!",
                        buttonText: "Embark on another journey"
                    },
                    {
                        title: "Exemplary Win!",
                        description: "You have demonstrated exemplary skill and emerged victorious! Your perseverance and dedication have led you to triumph. Celebrate your success!",
                        buttonText: "Face the challenge again"
                    }
                ];

                $scope.lossMessages = [
                    {
                        title: "Defeat",
                        description: "Alas, victory eludes you this time. But fear not, for defeat is not the end. Learn from this experience, hone your skills, and rise again to conquer!",
                        buttonText: "Try again"
                    },
                    {
                        title: "Tough Luck",
                        description: "Despite your valiant efforts, victory slipped through your fingers this time. Take heart, for every setback is an opportunity to grow stronger. Keep striving!",
                        buttonText: "Start over"
                    },
                    {
                        title: "Unfortunate Loss",
                        description: "It's disappointing to face defeat, but remember, even the greatest warriors have tasted defeat. Use this setback as fuel for your determination to succeed next time!",
                        buttonText: "Embark on a new challenge"
                    },
                    {
                        title: "Learning Experience",
                        description: "In defeat, there is wisdom. Reflect on your journey, analyze your strategies, and emerge stronger from this setback. Your next victory awaits!",
                        buttonText: "Press on"
                    },
                    {
                        title: "Setback",
                        description: "Though you have faltered in this battle, remember that every setback is a stepping stone to success. Regroup, re-strategize, and march forward with renewed vigor!",
                        buttonText: "Face the challenge anew"
                    },
                    {
                        title: "Temporary Defeat",
                        description: "This may be a setback, but it is not the end of your journey. Learn from this defeat, adapt your strategy, and emerge stronger for the next battle ahead!",
                        buttonText: "Try once more"
                    },
                    {
                        title: "Momentary Loss",
                        description: "A momentary setback in your quest for victory. Gather your strength, reassess your approach, and prepare to overcome the next challenge that comes your way!",
                        buttonText: "Restart the journey"
                    },
                    {
                        title: "Conqueror's Dilemma",
                        description: "Even the mightiest of conquerors face defeat at times. Take this as an opportunity to refine your tactics and come back stronger than ever before!",
                        buttonText: "Continue the quest"
                    },
                    {
                        title: "Temporary Setback",
                        description: "A setback today is but a stepping stone for tomorrow's success. Stay resilient, learn from this loss, and forge ahead with unwavering determination!",
                        buttonText: "Face the challenge again"
                    },
                    {
                        title: "Defeat is Temporary",
                        description: "Though you may have lost this battle, remember that defeat is temporary. Rise again, stronger and wiser, and claim victory over the challenges that lie ahead!",
                        buttonText: "Press forward"
                    }
                ];

                // Function to select a random message from the array
                $scope.getRandomMessage = function (messages) {
                    return messages[Math.floor(Math.random() * messages.length)];
                };

                const defaultInvy = [
                    {
                        "img": shark,
                        "name": "Shark"
                    }, {
                        "img": shark,
                        "name": "Shark"
                    }, {
                        "img": shark,
                        "name": "Shark"
                    }, {
                        "img": shark,
                        "name": "Shark"
                    }, {
                        "img": shark,
                        "name": "Shark"
                    }
                ];

                $scope.foodEnabled = false;
                $scope.boxing = false;

                function initGame() {
                    $scope.winner = false;
                    $scope.fighting = false;
                    $scope.p1Hit = 0;
                    $scope.p2Hit = 0;
                    $scope.countDown = null;
                    $scope.player1 = {
                        "name": "You",
                        "has_eaten": false,
                        "total_damage": 0,
                        "hitpoints": 99,
                        "image": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/209305/player.png",
                        "inventory": [...defaultInvy],
                    };
                    $scope.player2 = {
                        "name": "Zezima",
                        "total_damage": 0,
                        "hitpoints": 99,
                        "image": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/209305/zezima.png",
                        "inventory": [...defaultInvy],
                    };

                    if (!$scope.foodEnabled) {
                        $scope.player1.inventory = [];
                        $scope.player2.inventory = [];
                    }

                    if ($scope.boxing) {
                        $scope.max = 11;
                        $scope.player1.image = 'https://66.media.tumblr.com/580fa319987f3ac50dd56d14c3178dbd/066a4891256f4b29-0f/s250x400/ead6252cc838d70088a8b5a8bef5d28d01059cde.png';
                        $scope.player2.image = 'https://66.media.tumblr.com/5142310cfbf6d40888452a180815d33d/066a4891256f4b29-e6/s250x400/ad6cd22c59a5ace06b77006f76d44e581b25f8ef.png';
                    } else {
                        $scope.max = 24;
                        $scope.player1.image = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/209305/player.png';
                        $scope.player2.image = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/209305/zezima.png';
                    }

                    showDamageIndicators();
                }

                initGame();

                function getRandomInt(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }

                function hideDamageIndicators() {
                    $('.splat').hide()
                    $('.damage-meter').hide()
                }

                function showDamageIndicators() {
                    $('.splat').show()
                    $('.damage-meter').show()
                }

                function updatePlayerDamage() {
                    $scope.p1Damage = $scope.player1.hitpoints - $scope.player1.total_damage;
                    $scope.p2Damage = $scope.player2.hitpoints - $scope.player2.total_damage;

                    if ($scope.p1Damage < 0) {
                        $scope.p1Damage = 0;
                    }
                    if ($scope.p2Damage < 0) {
                        $scope.p2Damage = 0;
                    }
                }

                function drawPlayerHealth() {
                    updatePlayerDamage();

                    $('#P1Dmg.health-display').css({
                        background:
                            '-webkit-linear-gradient(top, rgba(128,0,0,1) '
                            + $scope.player1.total_damage + '%,rgba(0,150,0,1) 0%)'
                    });

                    $('#P2Dmg.health-display').css({
                        background:
                            '-webkit-linear-gradient(top, rgba(128,0,0,1) '
                            + $scope.player2.total_damage + '%,rgba(0,150,0,1) 0%)'
                    });

                    $('#Player1.damage-total').css({
                        'width': $scope.player1.total_damage + '%'
                    });
                    $('#Player2.damage-total').css({
                        'width': $scope.player2.total_damage + '%'
                    });
                } drawPlayerHealth(); // initial draw

                function gameLoop() {
                    let gameLoop = $interval(function () {
                        $scope.fighting = true;

                        $scope.player1.damage_taken = getRandomInt(0, $scope.max);
                        $scope.player1.total_damage =
                            $scope.player1.total_damage + $scope.player1.damage_taken;

                        $scope.player2.damage_taken = getRandomInt(0, $scope.max);
                        $scope.player2.total_damage =
                            $scope.player2.total_damage + $scope.player2.damage_taken;

                        if ($scope.player1.total_damage >= $scope.player1.hitpoints) {

                            $scope.winner = $scope.player2.name;
                            $scope.lossMessage = $scope.getRandomMessage($scope.lossMessages);
                            $scope.playSound("/media/RuneScape Death.ogg");
                            console.log('Winner: ' + $scope.winner);
                            $interval.cancel(gameLoop);
                            $timeout(hideDamageIndicators, 3000);

                        }

                        if ($scope.player2.total_damage >= $scope.player2.hitpoints) {

                            $scope.winner = $scope.player1.name;
                            $scope.winMessage = $scope.getRandomMessage($scope.winMessages);
                            $scope.playSound("/media/RuneScape Sound.ogg");
                            console.log('Winner: ' + $scope.winner);
                            $interval.cancel(gameLoop);
                            $timeout(hideDamageIndicators, 3000);

                        } else if ($scope.player2.total_damage > getRandomInt(70, 80)) {

                            // if neither player has struck a winning hit, have zezima eat
                            if ($scope.player2.inventory != 0) {
                                $scope.eatFoodPlayerTwo();
                            }

                        }
                        if ($scope.player1.total_damage >= $scope.player1.hitpoints &&
                            $scope.player2.total_damage >= $scope.player2.hitpoints) {

                            $scope.winner = 'tie';
                            console.log('Winner: ' + $scope.tie);

                            $interval.cancel(gameLoop);
                            $timeout(hideDamageIndicators, 3000);
                        }

                        drawPlayerHealth();
                    }, 1800);
                }

                $scope.startFight = function () {
                    $scope.countDown = 3;
                    let countdown = $interval(function () {
                        if ($scope.countDown > 1) {
                            $scope.countDown--;
                        } else {
                            $scope.countDown = 'Fight!';
                            $interval.cancel(countdown);
                        }
                    }, 1000);

                    $timeout(function () {
                        gameLoop();
                    }, 3000);
                }

                $scope.eatFoodPlayerOne = function (data) {
                    if ($scope.player1.total_damage >= 20) {
                        console.log('You eat a Shark.');

                        $scope.player1.has_eaten = true;
                        $scope.player1.inventory.splice(data, 1);
                        $scope.player1.total_damage =
                            $scope.player1.total_damage - 20;

                        drawPlayerHealth();
                        console.log('It heals some health.');
                    }
                }

                $scope.eatFoodPlayerTwo = function (data) {
                    if ($scope.player2.total_damage >= 20) {
                        console.log('Zezima eats a Shark.')
                        $scope.player2.inventory.splice(data, 1);
                        $scope.player2.total_damage =
                            $scope.player2.total_damage - 20;

                        drawPlayerHealth();
                        console.log('It heals some health.');
                    }
                }

                $scope.restart = function () {
                    initGame();
                    drawPlayerHealth();
                };

                $scope.updateInventory = function () {
                    initGame();
                }

                $scope.updateFight = function () {
                    $scope.boxing = !!$scope.boxing;
                    initGame();
                }

                $('#loader').removeClass('fader');
            }
        ]);