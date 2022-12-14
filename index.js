const StarterMoney = 1669;
var CurrentMoney = StarterMoney;
var money = document.getElementById('money');
var purchases = {};

money.innerText = "$" + CurrentMoney.toString();

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

function formatDate(dateString) {
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
	$.get('https://api.github.com/repos/imightknoiw/spend-my-money/branches/main', function(repository) {
		document.getElementById('lastUpdated').innerText = formatDate(repository.commit.commit.author.date);
	});

	var items = document.getElementsByClassName('item');
	for (var i = 0; i < items.length; i++) {
		var label = items[i].children[0];
		var button = items[i].children[2];
		var input = items[i].children[3];
		var itemName = 'item' + (i + 1).toString();
		
		label.innerText = 'Item ' + (i + 1).toString();
		
		button.id = itemName;
		purchases[itemName] = 0;
		button.innerText = "buy for $" + button.value + " (" + purchases[itemName] + "x)";
		document.addEventListener('keyup', function(e){
			var buttonActive = document.activeElement === button;
			if (e.keyCode === 13 && buttonActive === true){
				e.preventDefault();	
			}	
		});
		
		input.placeholder = "Amount to restore";
		input.disabled = true;
		input.max = (Math.floor(purchases[itemName]) / 2);
		input.addEventListener('keyup', function(e) {
			if (e.keyCode === 13 && document.activeElement.nodeName === "INPUT") {
				if (!document.activeElement.disabled && document.activeElement.value.length > 0){
					add(document.activeElement);
				} 
			}
		});
	}
	

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
		e.innerText = "buy for $" + a + " (" + purchases[e.id] + "x)";
		if (Math.floor(purchases[e.id]) > 0) {
			e.nextElementSibling.disabled = false;
			alert("enabled elem:"+e.nextElementSibling.tagName);
		} else {
			e.nextElementSibling.disabled = true;
			alert("disabled elem:"+e.nextElementSibling.tagName);
		}
		e.nextElementSibling.max = Math.floor(purchases[e.id]) / 2;
		var subFloat = document.createElement('span');
		subFloat.style.zIndex = "9999";
		subFloat.style.right = "0";
		subFloat.style.position = "fixed";
		subFloat.innerText = "-$" + a.toString();
		subFloat.classList.add('animate__animated', 'animate__fadeOutUp', 'red');
		money.appendChild(subFloat);
		setTimeout(function() {
			subFloat.remove();
		}, 2000);
	}
}

function add(e) {
	var a = e.previousSibling.value,
	    NewAmount = (CurrentMoney + a);
	CurrentMoney = NewAmount;
	money.innerText = "$" + NewAmount;
	purchases[e.previousSibling.id] = Math.floor(purchases[e.previousSibling.id]) - 1;
	e.previousSibling.innerText = "buy for $" + a + " (" + purchases[e.previousSibling.id] + "x)";
	if (Math.floor(purchases[e.previousSibling.id]) > 0) {
		e.disabled = false;
		alert("enabled elem:"+e.tagName);
	} else {
		e.disabled = true;
		alert("disabled elem:"+e.tagName);
	}
	e.max = Math.floor(purchases[e.id]) / 2;
	e.value = '';
	var subFloat = document.createElement('span');
	subFloat.style.zIndex = "9999";
	subFloat.style.right = "0";
	subFloat.style.position = "fixed";
	subFloat.innerText = "+$" + a.toString();
	subFloat.classList.add('animate__animated', 'animate__fadeOutUp', 'green');
	money.appendChild(subFloat);
	setTimeout(function() {
		subFloat.remove();
	}, 2000);
}
