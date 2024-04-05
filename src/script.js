angular
  .module('duellingApp', [])
  .controller('GameController',
  ['$scope', '$interval', '$timeout', '$window',
  function gameController($scope, $interval, $timeout, $window) {
    const shark = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/209305/shark.png';
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
      
      if($scope.p1Damage < 0) {
        $scope.p1Damage = 0;
      }
      if($scope.p2Damage < 0) {
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
      let gameLoop = $interval(function() {
        $scope.fighting = true;

        $scope.player1.damage_taken = getRandomInt(0, $scope.max);
        $scope.player1.total_damage =
          $scope.player1.total_damage + $scope.player1.damage_taken;

        $scope.player2.damage_taken = getRandomInt(0, $scope.max);
        $scope.player2.total_damage =
          $scope.player2.total_damage + $scope.player2.damage_taken;

        if ($scope.player1.total_damage >= $scope.player1.hitpoints) {

          $scope.winner = $scope.player2.name;
          console.log('Winner: ' + $scope.winner);

          $interval.cancel(gameLoop);
          $timeout(hideDamageIndicators, 3000);

        }

        if ($scope.player2.total_damage >= $scope.player2.hitpoints) {

          $scope.winner = $scope.player1.name;
          console.log('Winner: ' + $scope.winner);

          $interval.cancel(gameLoop);
          $timeout(hideDamageIndicators, 3000);

        } else if($scope.player2.total_damage > getRandomInt(70, 80)) {

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
    
    $scope.startFight = function() {
        $scope.countDown = 3;
        let countdown = $interval(function() {
          if ($scope.countDown > 1) {
            $scope.countDown--;
          } else {
            $scope.countDown = 'Fight!';
            $interval.cancel(countdown);
          }
        }, 1000);

        $timeout(function() {
          gameLoop();
        }, 3000);
    }
    
    $scope.eatFoodPlayerOne = function(data) {
      if($scope.player1.total_damage >= 20) {
        console.log('You eat a Shark.');
        
        $scope.player1.has_eaten = true;
        $scope.player1.inventory.splice(data, 1);
        $scope.player1.total_damage =
          $scope.player1.total_damage - 20;
        
        drawPlayerHealth();
        console.log('It heals some health.');
      }
    }
    
    $scope.eatFoodPlayerTwo = function(data) {
      if($scope.player2.total_damage >= 20) {
        console.log('Zezima eats a Shark.')
        $scope.player2.inventory.splice(data, 1);
        $scope.player2.total_damage =
          $scope.player2.total_damage - 20;
        
        drawPlayerHealth();
        console.log('It heals some health.');
      }
    }
    
    $scope.restart = function() {
      initGame();
      drawPlayerHealth();
    };
    
    $scope.updateInventory = function() {
      initGame();
    }
    
    $scope.updateFight = function() {
      $scope.boxing = !!$scope.boxing;
      initGame();
    }
    
    $('#loader').removeClass('fader');
  }
]);