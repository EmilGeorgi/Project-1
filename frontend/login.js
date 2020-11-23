let userId;
$(document).ready(function () {
  $('#submit-login').click(function () {
    event.preventDefault();
    $.post('http://localhost:3000/login?Username=' + $('#username').val() + '&Password=' + $('#password').val()).done(function (data) {
      if(data.error){
        alert(data.message);
      }
      else {
        $('#submit-login').remove();
        userId = data.user.UserId
        if (data.user.Roles === 'User') {
          $('.container').load('http://localhost:5500/frontend/message.html #message',function () {
            $.get('http://localhost:3000/message?userId=' + userId).done(function (data) {
              $('#daily_message').text(data.message)
            });
            $('#logout').click(function() {
              console.log('test')
              location.reload();
            });
          });
        }
        if (data.user.Roles === 'Moderator') {
          $('.container').load('http://localhost:5500/frontend/message.html #content', () => {
            $.get('http://localhost:3000/message?userId=' + userId).done(function (data) {
              $('#daily_message').text(data.message)
            });
            $('#logout').click(function() {
              console.log('test')
              location.reload();
            });
            $('#submit').click(function () {
              event.preventDefault();
              $.post('http://localhost:3000/message?message=' + $('#messagecontent').val() + '&userId=' + userId, { data: {
                content: JSON.stringify($('#messagecontent').text())
              },
              }).done(function(data) {
                if(data.affectedRows > 0) {
                  alert('message added');
                  $.get('http://localhost:3000/message?userId=' + userId).done(function (data) {
                    $('#daily_message').text(data.message)
                  });
                }
              });
            });
          });
        }
        if (data.user.Roles === 'Administrator') {
          $('#username').val('');
          $('#password').val('');
          $('#currtitle').text('Create user');
          $('.container').append('<input type="submit" class="btn btn-primary mb-2 CreateUser" value="Submit">');
          $('#admin').load('http://localhost:5500/frontend/message.html #content', () => {
            $.get('http://localhost:3000/message?userId=' + userId).done(function (data) {
              $('#daily_message').text(data.message)
            });
            $('#logout').click(function() {
              console.log('test')
              location.reload();
            });
            $('#submit').click(function () {
              event.preventDefault();
              $.post('http://localhost:3000/message?message=' + $('#messagecontent').val() + '&userId=' + userId, { data: {
                  content: JSON.stringify($('#messagecontent').text())
                },
              }).done(function(data) {
                if(data.affectedRows > 0) {
                  alert('message added');
                  $.get('http://localhost:3000/message?userId=' + userId).done(function (data) {
                    $('#daily_message').text(data.message)
                  });
                }
              });
            });
          $('.CreateUser').click(function () {
            $.post('http://localhost:3000/user?Username=' + $('#username').val() + '&Password=' + $('#password').val() + '&userId=' + data.user.UserId + '&Roles=' + data.user.Roles).done(function (data) {
              if(data.affectedRows > 0) {
                alert('User has been created');
                $('#username').val();
                $('#password').val();
              } else {
                alert('the username is already in use');
              }
              });
            });
          })
        }
      }
    });
  })
})