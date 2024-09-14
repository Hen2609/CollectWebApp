function getSideBarState(){
    var state = document.body.getAttribute('data-drawer-open')
    return state === "true"
}

function sideBarToggle(){
    const state = getSideBarState()
    updateSideBarState(!state)
}
/** 
 * @async
 * @function updateSideBarState
 * @param { Boolean } value
 */
function updateSideBarState(value){
    const sideBar = document.getElementById("sidebar")
    document.body.setAttribute('data-drawer-open',value)
    sideBar.setAttribute('aria-hidden', !value)
}

window.addEventListener('DOMContentLoaded', () => {
    const sidebarButton = document.getElementById('sidebar-toggle')
    sidebarButton.addEventListener('click',sideBarToggle)
    const sideBarClose = document.getElementById('close-sidbar')
    sideBarClose.addEventListener('click', () => updateSideBarState(false))
    const date = new Date().toISOString().split('T')[0];
    const url = `https://www.hebcal.com/converter?cfg=json&date=${date}&g2h=1&strict=1`;
    $.ajax({
        url,
        success: function( data ) {
            $('#current-date').html(data.hebrew);
        },
        error: function(){
            $('#current-date').html(new Date().toLocaleDateString('he-IL'));
        }
      });
})

$("#signup-submit-button").on("click", () => {
    const form = $("#signup-form")
    $.ajax({
        method: "POST",
        url: "/api/user/signup",
        data: form.serialize(),
        success: function() {
            window.location.reload()
        },
        error: function(jqXHR) {
            const error_code = jqXHR.responseJSON.code
            switch(error_code){
                case 1:
                    alert('חובה לספק מזהה משתמש')
                    break;
                case 2:
                    alert('חובה לספק שם ')
                    break;
                case 3:
                    alert('חובה לספק סיסמה')
                    break;
                case 4:
                    alert('מזהה משתמש תפוס')
                    break;
                default:
                    alert('שגיאה לא ידוע בהרשמה')
                    break;
            }
        }
      });
})

$("#login-submit-button").on("click", () => {
    const form = $("#login-form")
    $.ajax({
        method: "POST",
        url: "/api/user/login",
        data: form.serialize(),
        success: function() {
            window.location.reload();
        },
        error: function(jqXHR) {
            const error_code = jqXHR.responseJSON.code
            switch(error_code){
                case 1:
                    alert('חובה לספק מזהה משתמש')
                    break;
                case 2:
                    alert('חובה לספק סיסמה')
                    break;
                default:
                    alert('שגיאה לא ידוע בהרשמה')
                    break;
            }
        }
    });
})

$("#signout-button").on("click", () => {
    $.ajax({
        method: "POST",
        url: "/api/user/logout",
        success: function() {
            window.location.reload();
        },
        error: function(jqXHR) {
            alert('שגיאה לא ידוע בהרשמה')
        }
    })
});
function updateCart(){
    const cart = JSON.parse(window.localStorage.getItem("cart"))
    const itemsCount = Object.keys(cart).reduce((res,cur) => {
        res += cart[cur]
        return res
    },0)
    $("#cart-badge").html(itemsCount)
}
document.addEventListener("DOMContentLoaded", updateCart)
document.addEventListener("cartChanged", () => {
    updateCart()
});
  