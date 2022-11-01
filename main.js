const StarterMoney = 1669;
var CurrentMoney = StarterMoney;
var money = document.getElementById('money');
money.innerText = "$" + CurrentMoney;
var lastUpdated = document.getElementById('lastUpdated');
let purchases = {};

function timeSince(date) {
	
	var seconds = Math.floor((new Date() - date) / 1000);
	var interval = seconds / 31536000;
	if (interval > 1) {
		return Math.floor(interval) + " years";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " months";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + " days";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + " hours";
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + " minutes";
	}
	return Math.floor(seconds) + " seconds";
}
function formatDate(dateString){
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric"
	};
	var date = new Date(dateString),
	   formattedDate = date.toLocaleDateString(undefined, options),
           ts = timeSince(date);       
        return `${formattedDate} (${ts} ago)`;
       }

window.onload = function() {
	
	var items = document.getElementsByClassName('item');
	for (var i = 0; i < items.length; i++) {
		var label = items[i].getElementsByTagName('label')[0],
		    button = items[i].getElementsByTagName('button')[0],
		    input = items[i].getElementsByTagName('input')[0],
		    itemName = 'item' + (i + 1).toString();
		
		label.innerText = 'Item ' + (i + 1).toString();
		label.addAttribute('for', itemName);
		
		button.id = itemName;
    	  	purchases[itemName] = 0;
   	  	button.innerText = "buy for $" + button.value + " ("+purchases[itemName]+"x)";
		
		input.placeholder = "Amount to restore";
		input.max = Math.floor(purchases[itemName]) / 2;
	}
	$.get('https://api.github.com/repos/imightknoiw/spend-my-money/branches/main', function(response) {
                lastUpdated.innerText = formatDate(response.commit.commit.author.date);
	});
};
window.onbeforeunload = function() {
	if (StarterMoney > CurrentMoney) {
		return "NO";
	}
};

function sub(e) {
	const a = e.value;
	if (a > CurrentMoney) {
		money.classList.add('animate__animated', 'animate__shakeX', 'red');
		setTimeout(function() {
			money.classList.remove('red');
			money.classList.remove('animate__animated', 'animate__shakeX');
		}, 2100);
	} else {
		const NewAmount = (CurrentMoney - a);
		CurrentMoney = NewAmount;
		money.innerText = "$" + NewAmount;
		purchases[e.id] = purchases[e.id] + 1;
		e.innerText = "buy for $" + a + " ("+purchases[e.id]+"x)";
                if (purchases[e.id] > 0){ 
			e.nextSibling.removeAttribute('readonly'); 
		} else { 
			e.nextSibling.addAttribute('readonly', 'readonly'); 
		}
		e.nextSibling.max = Math.floor(purchases[e.id] / 2);
		var subFloat = document.createElement('span');
		subFloat.style.zIndex = "9999";
		subFloat.style.right = "0";
		subFloat.style.position = "fixed";
		subFloat.innerText = "-$"+a.toString();
		subFloat.classList.add('animate__animated', 'animate__fadeOutUp', 'red');
		money.appendChild(subFloat);
		setTimeout(function(){
		  subFloat.remove();
		}, 2000);
	}
}
document.addEventListener('keyup', function(e){
  if (e.key == "Enter" && document.activeElement.nodeName == "INPUT"){
	  add(document.activeElement);
  }
});	
		
function add(e){
        var a = e.previousSibling.value;
	var NewAmount = (CurrentMoney + a);
	CurrentMoney = NewAmount;
	money.innerText = "$" + CurrentMoney;
	purchases[e.previousSibling.id] = purchases[e.previousSibling.id] - 1;
	e.previousSibling.innerText = "buy for $" + a + " ("+purchases[e.previousSibling.id]+"x)";
        if (purchases[e.previousSibling.id] > 0){ e.removeAttribute('readonly'); } else {e.previousSibling.addAttribute('readonly', 'readonly');}
	e.max = Math.floor(purchases[e.id] / 2);
	e.value = '';
        var subFloat = document.createElement('span');
	subFloat.style.zIndex = "9999";
	subFloat.style.right = "0";
	subFloat.style.position = "fixed";
	subFloat.innerText = "+$"+a.toString();
	subFloat.classList.add('animate__animated', 'animate__fadeOutUp', 'green');
	money.appendChild(subFloat);
	setTimeout(function(){
  		subFloat.remove();
	}, 2000);
}