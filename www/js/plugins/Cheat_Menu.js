
/////////////////////////////////////////////////
// Cheat Menu Plugin Class
/////////////////////////////////////////////////
if (typeof Cheat_Menu == "undefined") { Cheat_Menu = {}; }

Cheat_Menu.initialized = false;
Cheat_Menu.cheat_menu_open = false;
Cheat_Menu.overlay_openable = false;
Cheat_Menu.menu_update_timer = null;

Cheat_Menu.cheat_selected = 0;
Cheat_Menu.cheat_selected_actor = 1;
Cheat_Menu.amounts = [1, 10, 100, 1000, 10000, 100000, 1000000];
Cheat_Menu.amount_index = 0;
Cheat_Menu.stat_selection = 0;
Cheat_Menu.item_selection = 1;
Cheat_Menu.weapon_selection = 1;
Cheat_Menu.armor_selection = 1;
Cheat_Menu.move_amounts = [0.5, 1, 1.5, 2];
Cheat_Menu.move_amount_index = 1;
Cheat_Menu.variable_selection = 1;
Cheat_Menu.switch_selection = 1;
Cheat_Menu.saved_positions = [{m: -1, x: -1, y: -1}, {m: -1, x: -1, y: -1}, {m: -1, x: -1, y: -1}];
Cheat_Menu.teleport_location = {m: 1, x: 0, y: 0};
Cheat_Menu.speed = null;
Cheat_Menu.speed_unlocked = true;
Cheat_Menu.speed_initialized = false;

if (typeof Cheat_Menu.initial_values == "undefined") { Cheat_Menu.initial_values = {}; }
Cheat_Menu.initial_values.cheat_selected = 0;
Cheat_Menu.initial_values.cheat_selected_actor = 1;
Cheat_Menu.initial_values.amount_index = 0;
Cheat_Menu.initial_values.stat_selection = 0;
Cheat_Menu.initial_values.item_selection = 1;
Cheat_Menu.initial_values.weapon_selection = 1;
Cheat_Menu.initial_values.armor_selection = 1;
Cheat_Menu.initial_values.move_amount_index = 1;
Cheat_Menu.initial_values.variable_selection = 1;
Cheat_Menu.initial_values.switch_selection = 1;
Cheat_Menu.initial_values.saved_positions = [{m: -1, x: -1, y: -1}, {m: -1, x: -1, y: -1}, {m: -1, x: -1, y: -1}];
Cheat_Menu.initial_values.teleport_location = {m: 1, x: 0, y: 0};
Cheat_Menu.initial_values.speed = null;
Cheat_Menu.initial_values.speed_unlocked = true;

/////////////////////////////////////////////////
// Cheat Functions
/////////////////////////////////////////////////

Cheat_Menu.god_mode = function(actor) {
	if (actor instanceof Game_Actor && !(actor.god_mode)) {
		actor.god_mode = true;
		actor.gainHP_bkup = actor.gainHp;
		actor.gainHp = function(value) { value = this.mhp; this.gainHP_bkup(value); };
		actor.setHp_bkup = actor.setHp;
		actor.setHp = function(hp) { hp = this.mhp; this.setHp_bkup(hp); };
		actor.gainMp_bkup = actor.gainMp;
		actor.gainMp = function (value) { value = this.mmp; this.gainMp_bkup(value); };
		actor.setMp_bkup = actor.setMp;
		actor.setMp = function(mp) { mp = this.mmp; this.setMp_bkup(mp); };
		actor.gainTp_bkup = actor.gainTp;
		actor.gainTp = function (value) { value = this.maxTp(); this.gainTp_bkup(value); };
		actor.setTp_bkup = actor.setTp;
		actor.setTp = function(tp) { tp = this.maxTp(); this.setTp_bkup(tp); };
		actor.paySkillCost_bkup = actor.paySkillCost;
		actor.paySkillCost = function (skill) {};
		actor.god_mode_interval = setInterval(function() {
			actor.gainHp(actor.mhp);
			actor.gainMp(actor.mmp);
			actor.gainTp(actor.maxTp());
		}, 100);
	}
};

Cheat_Menu.god_mode_off = function(actor) {
	if (actor instanceof Game_Actor && actor.god_mode) {
		actor.god_mode = false;
		actor.gainHp = actor.gainHP_bkup;
		actor.setHp = actor.setHp_bkup;
		actor.gainMp = actor.gainMp_bkup;
		actor.setMp = actor.setMp_bkup;
		actor.gainTp = actor.gainTp_bkup;
		actor.setTp = actor.setTp_bkup;
		actor.paySkillCost = actor.paySkillCost_bkup;
		clearInterval(actor.god_mode_interval);
	}
};

Cheat_Menu.set_party_hp = function(hp, alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) members[i].setHp(hp);
	}
};

Cheat_Menu.set_party_mp = function(mp, alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) members[i].setMp(mp);
	}
};

Cheat_Menu.set_party_tp = function(tp, alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) members[i].setTp(tp);
	}
};

Cheat_Menu.recover_party_hp = function(alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) members[i].setHp(members[i].mhp);
	}
};

Cheat_Menu.recover_party_mp = function(alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) members[i].setMp(members[i].mmp);
	}
};

Cheat_Menu.recover_party_tp = function(alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) members[i].setTp(members[i].maxTp());
	}
};

Cheat_Menu.set_enemy_hp = function(hp, alive) {
	var members = $gameTroop.members();
	for (var i = 0; i < members.length; i++) {
		if (members[i] && ((alive && members[i]._hp != 0) || !alive)) {
				members[i].setHp(hp);
		}
	}
};

Cheat_Menu.give_exp = function(actor, amount) {
	if (actor instanceof Game_Actor) actor.gainExp(amount);
};

Cheat_Menu.give_stat = function(actor, stat_index, amount) {
	if (actor instanceof Game_Actor && actor._paramPlus[stat_index] != undefined) {
			actor.addParam(stat_index, amount);
	}
};

Cheat_Menu.give_gold = function(amount) { $gameParty.gainGold(amount); };
Cheat_Menu.give_item = function(item_id, amount) {
	if ($dataItems[item_id] != undefined) $gameParty.gainItem($dataItems[item_id], amount);
};
Cheat_Menu.give_weapon = function(weapon_id, amount) {
	if ($dataWeapons[weapon_id] != undefined) $gameParty.gainItem($dataWeapons[weapon_id], amount);
};
Cheat_Menu.give_armor = function(armor_id, amount) {
	if ($dataArmors[armor_id] != undefined) $gameParty.gainItem($dataArmors[armor_id], amount);
};

Cheat_Menu.initialize_speed_lock = function() {
	if (!Cheat_Menu.speed_initialized) {
		Cheat_Menu.speed = $gamePlayer._moveSpeed;
		Object.defineProperty($gamePlayer, "_moveSpeed", {
			get: function() {return Cheat_Menu.speed;},
			set: function(newVal) {if(Cheat_Menu.speed_unlocked) {Cheat_Menu.speed = newVal;}}
		});
		Cheat_Menu.speed_initialized = true;
	}
};

Cheat_Menu.change_player_speed = function(amount) {
	Cheat_Menu.initialize_speed_lock();
	Cheat_Menu.speed += amount;
};

Cheat_Menu.toggle_lock_player_speed = function() {
	Cheat_Menu.initialize_speed_lock();
	Cheat_Menu.speed_unlocked = !Cheat_Menu.speed_unlocked;
};

Cheat_Menu.clear_actor_states = function(actor) {
	if (actor instanceof Game_Actor && actor._states != undefined && actor._states.length > 0) {
			actor.clearStates();
	}
};

Cheat_Menu.clear_party_states = function() {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		Cheat_Menu.clear_actor_states(members[i]);
	}
};

Cheat_Menu.set_variable = function(variable_id, value) {
	if ($dataSystem.variables[variable_id] != undefined) {
		$gameVariables.setValue(variable_id, $gameVariables.value(variable_id) + value);
	}
};

Cheat_Menu.toggle_switch = function(switch_id) {
	if ($dataSystem.switches[switch_id] != undefined) {
		$gameSwitches.setValue(switch_id, !$gameSwitches.value(switch_id));
	}
};

Cheat_Menu.teleport = function(map_id, x_pos, y_pos) {
	$gamePlayer.reserveTransfer(map_id, x_pos, y_pos, $gamePlayer.direction(), 0);
	$gamePlayer.setPosition(x_pos, y_pos);
};

/////////////////////////////////////////////////
// Modern UI System
/////////////////////////////////////////////////

Cheat_Menu.style_css = document.createElement("link");
Cheat_Menu.style_css.type = "text/css";
Cheat_Menu.style_css.rel = "stylesheet";
Cheat_Menu.style_css.href = "js/plugins/Cheat_Menu.css";
document.head.appendChild(Cheat_Menu.style_css);

Cheat_Menu.createMenuContainer = function() {
	var container = document.createElement('div');
	container.id = "cheat_menu_container";
	container.className = "cheat-menu-container";
	
	// Make draggable
	var isDragging = false;
	var currentX, currentY, initialX, initialY;
	var dragStartElement = null;
	
	var startDrag = function(e) {
		// Only allow dragging from header, and not from interactive elements
		if (e.target.closest('.cheat-menu-close') || 
			e.target.closest('.cheat-input-controls') || 
			e.target.closest('.cheat-btn') ||
			e.target.closest('.cheat-card-grid') ||
			e.target.closest('.cheat-card') ||
			e.target.closest('.cheat-menu-content') ||
			e.target.closest('.cheat-menu-sidebar') ||
			e.target.closest('input') ||
			e.target.closest('button')) {
			return;
		}
		
		if (e.target.closest('.cheat-menu-header')) {
			dragStartElement = e.target.closest('.cheat-menu-header');
			initialX = e.clientX - (container.offsetLeft || 0);
			initialY = e.clientY - (container.offsetTop || 0);
			isDragging = true;
			container.style.cursor = 'grabbing';
			dragStartElement.style.cursor = 'grabbing';
		}
	};
	
	var drag = function(e) {
		if (isDragging) {
			// Don't prevent default if we're over scrollable areas
			if (!e.target.closest('.cheat-card-grid') && 
				!e.target.closest('.cheat-menu-content') &&
				!e.target.closest('.cheat-menu-sidebar')) {
				e.preventDefault();
			}
			currentX = e.clientX - initialX;
			currentY = e.clientY - initialY;
			container.style.left = currentX + 'px';
			container.style.top = currentY + 'px';
			container.style.transform = 'none';
		}
	};
	
	var stopDrag = function() {
		if (isDragging) {
			isDragging = false;
			container.style.cursor = '';
			if (dragStartElement) {
				dragStartElement.style.cursor = 'grab';
			}
			dragStartElement = null;
		}
	};
	
	container.addEventListener('mousedown', startDrag);
	document.addEventListener('mousemove', drag);
	document.addEventListener('mouseup', stopDrag);
	
	// Header
	var header = document.createElement('div');
	header.className = "cheat-menu-header";
	header.style.cursor = 'grab';
	var title = document.createElement('div');
	title.className = "cheat-menu-title";
	title.textContent = "CHEAT MENU";
	var closeBtn = document.createElement('button');
	closeBtn.className = "cheat-menu-close";
	closeBtn.innerHTML = "×";
	closeBtn.addEventListener('click', function() {
		Cheat_Menu.cheat_menu_open = false;
		if (Cheat_Menu.menuContainer) {
			Cheat_Menu.menuContainer.remove();
			Cheat_Menu.menuContainer = null;
		}
		SoundManager.playSystemSound(2);
	});
	header.appendChild(title);
	header.appendChild(closeBtn);
	container.appendChild(header);
	
	// Main content wrapper
	var wrapper = document.createElement('div');
	wrapper.className = "cheat-menu-wrapper";
	
	// Sidebar
	var sidebar = document.createElement('div');
	sidebar.className = "cheat-menu-sidebar";
	wrapper.appendChild(sidebar);
	
	// Content area
	var contentArea = document.createElement('div');
	contentArea.className = "cheat-menu-content";
	wrapper.appendChild(contentArea);
	
	container.appendChild(wrapper);
	return container;
};

if (typeof Cheat_Menu.menuDefinitions == "undefined") { 
	Cheat_Menu.menuDefinitions = [
		{ name: "God Mode", id: "godmode", icon: "⚡" },
		{ name: "No Clip", id: "noclip", icon: "👻" },
		{ name: "Enemy HP", id: "enemyhp", icon: "💀" },
		{ name: "Party HP", id: "partyhp", icon: "❤️" },
		{ name: "Party MP", id: "partymp", icon: "💙" },
		{ name: "Party TP", id: "partytp", icon: "💜" },
		{ name: "Give Exp", id: "exp", icon: "⭐" },
		{ name: "Stats", id: "stats", icon: "📊" },
		{ name: "Gold", id: "gold", icon: "💰" },
		{ name: "Items", id: "items", icon: "🎒" },
		{ name: "Weapons", id: "weapons", icon: "⚔️" },
		{ name: "Armors", id: "armors", icon: "🛡️" },
		{ name: "Speed", id: "speed", icon: "🏃" },
		{ name: "Clear States", id: "states", icon: "🧹" },
		{ name: "Variables", id: "variables", icon: "🔢" },
		{ name: "Switches", id: "switches", icon: "🔘" },
		{ name: "Save/Recall", id: "positions", icon: "📍" },
		{ name: "Teleport", id: "teleport", icon: "🚀" }
	];
}

Cheat_Menu.createSidebar = function(container) {
	var sidebar = container.querySelector('.cheat-menu-sidebar');
	sidebar.innerHTML = '';
	
	for (var i = 0; i < Cheat_Menu.menuDefinitions.length; i++) {
		var item = document.createElement('div');
		item.className = "cheat-menu-sidebar-item" + (i === Cheat_Menu.cheat_selected ? " active" : "");
		item.dataset.tabIndex = i;
		
		var icon = document.createElement('span');
		icon.className = "cheat-menu-icon";
		icon.textContent = Cheat_Menu.menuDefinitions[i].icon;
		
		var text = document.createElement('span');
		text.className = "cheat-menu-text";
		text.textContent = Cheat_Menu.menuDefinitions[i].name;
		
		item.appendChild(icon);
		item.appendChild(text);
		
		item.addEventListener('click', function() {
			Cheat_Menu.cheat_selected = parseInt(this.dataset.tabIndex);
	Cheat_Menu.update_menu();
	SoundManager.playSystemSound(0);
		});
		
		sidebar.appendChild(item);
	}
};

Cheat_Menu.createButton = function(text, onClick, className) {
	var button = document.createElement('button');
	button.className = className || "cheat-btn";
	button.textContent = text;
	button.addEventListener('click', onClick);
	return button;
};

Cheat_Menu.createInputGroup = function(label, value, onDecrease, onIncrease) {
	var group = document.createElement('div');
	group.className = "cheat-input-group";
	
	var labelEl = document.createElement('label');
	labelEl.className = "cheat-input-label";
	labelEl.textContent = label;
	group.appendChild(labelEl);
	
	var controls = document.createElement('div');
	controls.className = "cheat-input-controls";
	
	var decBtn = Cheat_Menu.createButton("−", onDecrease, "cheat-btn-control");
	var valueEl = document.createElement('span');
	valueEl.className = "cheat-value";
	valueEl.textContent = value;
	var incBtn = Cheat_Menu.createButton("+", onIncrease, "cheat-btn-control");
	
	controls.appendChild(decBtn);
	controls.appendChild(valueEl);
	controls.appendChild(incBtn);
	
	group.appendChild(controls);
	return group;
};

Cheat_Menu.createSection = function(title) {
	var section = document.createElement('div');
	section.className = "cheat-section";
	if (title) {
		var titleEl = document.createElement('h3');
		titleEl.className = "cheat-section-title";
		titleEl.textContent = title;
		section.appendChild(titleEl);
	}
	return section;
};

// Create card grid instead of selector
Cheat_Menu.createCardGrid = function(label, items, currentIndex, onSelect, getDisplayName, getExtraInfo) {
	var section = document.createElement('div');
	section.className = "cheat-card-section";
	
	var labelEl = document.createElement('div');
	labelEl.className = "cheat-card-label";
	labelEl.textContent = label;
	section.appendChild(labelEl);
	
	var searchInput = document.createElement('input');
	searchInput.type = "text";
	searchInput.className = "cheat-card-search";
	searchInput.placeholder = "Search...";
	var searchTerm = "";
	var savedScrollPosition = 0;
	
	// Store scroll position before update
	var saveScroll = function() {
		if (grid && grid.scrollTop !== undefined) {
			savedScrollPosition = grid.scrollTop;
		}
	};
	
	// Restore scroll position after update
	var restoreScroll = function() {
		if (grid && savedScrollPosition !== undefined) {
			// Use requestAnimationFrame to ensure DOM is updated
			requestAnimationFrame(function() {
				if (grid) {
					grid.scrollTop = savedScrollPosition;
				}
			});
		}
	};
	
	searchInput.addEventListener('input', function() {
		searchTerm = this.value.toLowerCase();
		saveScroll();
		updateGrid();
		restoreScroll();
	});
	section.appendChild(searchInput);
	
	var grid = document.createElement('div');
	grid.className = "cheat-card-grid";
	// Use label as stable ID to maintain scroll position per grid type
	var gridId = "grid_" + label.replace(/[^a-zA-Z0-9]/g, '_');
	grid.dataset.gridId = gridId;
	
	var updateGrid = function(preserveScroll) {
		if (preserveScroll) {
			saveScroll();
		}
		grid.innerHTML = '';
		for (var i = 0; i < items.length; i++) {
			if (items[i] == null || items[i] == undefined) continue;
			var name = getDisplayName ? getDisplayName(i, items[i]) : (items[i].name || items[i] || "NULL");
			if (searchTerm && name.toLowerCase().indexOf(searchTerm) === -1) continue;
			
			var card = document.createElement('div');
			card.className = "cheat-card" + (i === currentIndex ? " active" : "");
			card.dataset.index = i;
			
			var cardName = document.createElement('div');
			cardName.className = "cheat-card-name";
			cardName.textContent = name;
			card.appendChild(cardName);
			
			if (getExtraInfo) {
				var extra = getExtraInfo(i, items[i]);
				if (extra) {
					var cardExtra = document.createElement('div');
					cardExtra.className = "cheat-card-extra";
					cardExtra.textContent = extra;
					card.appendChild(cardExtra);
				}
			}
			
			card.addEventListener('click', function(e) {
				// Don't trigger click if user was scrolling
				if (grid.isScrolling) return;
				var idx = parseInt(this.dataset.index);
				onSelect(idx);
				// Don't update menu immediately to preserve scroll
				setTimeout(function() {
					Cheat_Menu.update_menu();
				}, 50);
				SoundManager.playSystemSound(0);
			});
			
			grid.appendChild(card);
		}
		if (preserveScroll) {
			restoreScroll();
		}
	};
	
	// Prevent card click when scrolling
	var scrollTimeout;
	grid.addEventListener('scroll', function() {
		grid.isScrolling = true;
		savedScrollPosition = grid.scrollTop;
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(function() {
			grid.isScrolling = false;
		}, 150);
	});
	
	// Stop event propagation for scroll events
	grid.addEventListener('wheel', function(e) {
		e.stopPropagation();
		savedScrollPosition = grid.scrollTop;
	}, { passive: true });
	
	grid.addEventListener('mousedown', function(e) {
		// Allow scrolling with mouse drag
		if (e.target.closest('.cheat-card')) {
			e.stopPropagation();
		}
	});
	
	// Store reference for scroll preservation
	grid.saveScroll = saveScroll;
	grid.restoreScroll = restoreScroll;
	grid.updateGrid = function() { updateGrid(true); };
	
	updateGrid(false);
	section.appendChild(grid);
	return section;
};

Cheat_Menu.createSelector = function(label, value, max, currentIndex, onSelect) {
	return Cheat_Menu.createInputGroup(label, value, function() {
		var newIndex = currentIndex - 1;
		if (newIndex < 0) newIndex = max - 1;
		onSelect(newIndex);
		Cheat_Menu.update_menu();
		SoundManager.playSystemSound(0);
	}, function() {
		var newIndex = currentIndex + 1;
		if (newIndex >= max) newIndex = 0;
		onSelect(newIndex);
	Cheat_Menu.update_menu();
		SoundManager.playSystemSound(0);
	});
};

Cheat_Menu.createAmountSelector = function() {
	return Cheat_Menu.createInputGroup("Amount", Cheat_Menu.amounts[Cheat_Menu.amount_index],
		function() {
			if (Cheat_Menu.amount_index > 0) Cheat_Menu.amount_index--;
			Cheat_Menu.update_menu();
			SoundManager.playSystemSound(2);
		},
		function() {
			if (Cheat_Menu.amount_index < Cheat_Menu.amounts.length - 1) Cheat_Menu.amount_index++;
		Cheat_Menu.update_menu();
	SoundManager.playSystemSound(1);
		}
	);
};

Cheat_Menu.createActorSelector = function() {
	return Cheat_Menu.createCardGrid("Select Actor", $gameActors._data, 
		Cheat_Menu.cheat_selected_actor, function(i) {
			Cheat_Menu.cheat_selected_actor = i;
		}, function(i, actor) {
			return actor && actor._name ? actor._name : "NULL";
		}, function(i, actor) {
			if (!actor) return null;
			var level = actor._level || 0;
			var hp = actor._hp || 0;
			var mhp = actor._mhp || 0;
			return "Lv." + level + " | HP: " + hp + "/" + mhp;
		});
};

Cheat_Menu.createToggleButton = function(label, isOn, onClick) {
	var status = isOn ? "ON" : "OFF";
	var btn = Cheat_Menu.createButton(label + ": " + status, onClick, "cheat-btn-toggle");
	btn.className += isOn ? " active" : "";
	return btn;
};

Cheat_Menu.buildPartyResourceMenu = function(contentArea, type) {
	var setFunc = type === "hp" ? Cheat_Menu.set_party_hp : (type === "mp" ? Cheat_Menu.set_party_mp : Cheat_Menu.set_party_tp);
	var recoverFunc = type === "hp" ? Cheat_Menu.recover_party_hp : (type === "mp" ? Cheat_Menu.recover_party_mp : Cheat_Menu.recover_party_tp);
	var label = type.toUpperCase();
	
	var section1 = Cheat_Menu.createSection("Alive Party");
	var btnGrid1 = document.createElement('div');
	btnGrid1.className = "cheat-btn-grid";
	btnGrid1.appendChild(Cheat_Menu.createButton("Set to 0", function() { setFunc(0, true); SoundManager.playSystemSound(1); }));
	btnGrid1.appendChild(Cheat_Menu.createButton("Set to 1", function() { setFunc(1, true); SoundManager.playSystemSound(1); }));
	btnGrid1.appendChild(Cheat_Menu.createButton("Full " + label, function() { recoverFunc(true); SoundManager.playSystemSound(1); }));
	section1.appendChild(btnGrid1);
	
	var section2 = Cheat_Menu.createSection("All Party");
	var btnGrid2 = document.createElement('div');
	btnGrid2.className = "cheat-btn-grid";
	btnGrid2.appendChild(Cheat_Menu.createButton("Set to 0", function() { setFunc(0, false); SoundManager.playSystemSound(1); }));
	btnGrid2.appendChild(Cheat_Menu.createButton("Set to 1", function() { setFunc(1, false); SoundManager.playSystemSound(1); }));
	btnGrid2.appendChild(Cheat_Menu.createButton("Full " + label, function() { recoverFunc(false); SoundManager.playSystemSound(1); }));
	section2.appendChild(btnGrid2);
	
	contentArea.appendChild(section1);
	contentArea.appendChild(section2);
};

Cheat_Menu.buildItemMenu = function(contentArea, type) {
	var selection = type === "item" ? Cheat_Menu.item_selection : (type === "weapon" ? Cheat_Menu.weapon_selection : Cheat_Menu.armor_selection);
	var data = type === "item" ? $dataItems : (type === "weapon" ? $dataWeapons : $dataArmors);
	var partyData = type === "item" ? $gameParty._items : (type === "weapon" ? $gameParty._weapons : $gameParty._armors);
	var giveFunc = type === "item" ? Cheat_Menu.give_item : (type === "weapon" ? Cheat_Menu.give_weapon : Cheat_Menu.give_armor);
	var label = type.charAt(0).toUpperCase() + type.slice(1);
	
	var section = Cheat_Menu.createSection();
	section.appendChild(Cheat_Menu.createAmountSelector());
	
	// Create card grid for items
	var cardSection = Cheat_Menu.createCardGrid("Select " + label, data, selection, function(i) {
		if (type === "item") Cheat_Menu.item_selection = i;
		else if (type === "weapon") Cheat_Menu.weapon_selection = i;
		else Cheat_Menu.armor_selection = i;
	}, function(i, item) {
		return (item && item.name && item.name.length > 0) ? item.name : "NULL";
	}, function(i, item) {
		var amount = partyData[i] || 0;
		return "Owned: " + amount;
	});
	section.appendChild(cardSection);
	
	// Current selected item controls
	var selectedSection = Cheat_Menu.createSection("Selected: " + ((data[selection] && data[selection].name) ? data[selection].name : "NULL"));
	var currentAmount = partyData[selection] || 0;
	var amountGroup = Cheat_Menu.createInputGroup("Current Amount", currentAmount,
		function() {
			giveFunc(selection, -Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();
		SoundManager.playSystemSound(2);
		},
		function() {
			giveFunc(selection, Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();
		SoundManager.playSystemSound(1);
	}
	);
	selectedSection.appendChild(amountGroup);
	section.appendChild(selectedSection);
	contentArea.appendChild(section);
};

var menuBuilders = {
	godmode: function(contentArea) {
		var section = Cheat_Menu.createSection();
		section.appendChild(Cheat_Menu.createActorSelector());
		var selectedSection = Cheat_Menu.createSection("Selected Actor");
		var actor = $gameActors._data[Cheat_Menu.cheat_selected_actor];
		var isOn = actor && actor.god_mode;
		selectedSection.appendChild(Cheat_Menu.createToggleButton("God Mode", isOn, function() {
			if (actor) {
				if (isOn) Cheat_Menu.god_mode_off(actor);
				else Cheat_Menu.god_mode(actor);
				SoundManager.playSystemSound(isOn ? 2 : 1);
	Cheat_Menu.update_menu();
			}
		}));
		section.appendChild(selectedSection);
		contentArea.appendChild(section);
	},
	noclip: function(contentArea) {
		var section = Cheat_Menu.createSection();
		section.appendChild(Cheat_Menu.createToggleButton("No Clip", $gamePlayer._through, function() {
			$gamePlayer._through = !$gamePlayer._through;
			SoundManager.playSystemSound($gamePlayer._through ? 1 : 2);
	Cheat_Menu.update_menu();
		}));
		contentArea.appendChild(section);
	},
	enemyhp: function(contentArea) {
		var s1 = Cheat_Menu.createSection("Alive Enemies");
		var grid1 = document.createElement('div');
		grid1.className = "cheat-btn-grid";
		grid1.appendChild(Cheat_Menu.createButton("Set HP to 0", function() { Cheat_Menu.set_enemy_hp(0, true); SoundManager.playSystemSound(1); }));
		grid1.appendChild(Cheat_Menu.createButton("Set HP to 1", function() { Cheat_Menu.set_enemy_hp(1, true); SoundManager.playSystemSound(1); }));
		s1.appendChild(grid1);
		var s2 = Cheat_Menu.createSection("All Enemies");
		var grid2 = document.createElement('div');
		grid2.className = "cheat-btn-grid";
		grid2.appendChild(Cheat_Menu.createButton("Set HP to 0", function() { Cheat_Menu.set_enemy_hp(0, false); SoundManager.playSystemSound(1); }));
		grid2.appendChild(Cheat_Menu.createButton("Set HP to 1", function() { Cheat_Menu.set_enemy_hp(1, false); SoundManager.playSystemSound(1); }));
		s2.appendChild(grid2);
		contentArea.appendChild(s1);
		contentArea.appendChild(s2);
	},
	partyhp: function(contentArea) { Cheat_Menu.buildPartyResourceMenu(contentArea, "hp"); },
	partymp: function(contentArea) { Cheat_Menu.buildPartyResourceMenu(contentArea, "mp"); },
	partytp: function(contentArea) { Cheat_Menu.buildPartyResourceMenu(contentArea, "tp"); },
	exp: function(contentArea) {
		var section = Cheat_Menu.createSection();
		section.appendChild(Cheat_Menu.createActorSelector());
		section.appendChild(Cheat_Menu.createAmountSelector());
		var actor = $gameActors._data[Cheat_Menu.cheat_selected_actor];
		var expGroup = Cheat_Menu.createInputGroup("Current EXP", actor ? actor.currentExp() : 0,
			function() {
				Cheat_Menu.give_exp(actor, -Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();
		SoundManager.playSystemSound(2);
			},
			function() {
				Cheat_Menu.give_exp(actor, Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();
		SoundManager.playSystemSound(1);
	}
		);
		section.appendChild(expGroup);
		contentArea.appendChild(section);
	},
	stats: function(contentArea) {
		var section = Cheat_Menu.createSection();
		section.appendChild(Cheat_Menu.createActorSelector());
		var actor = $gameActors._data[Cheat_Menu.cheat_selected_actor];
		if (actor && actor._paramPlus) {
			if (Cheat_Menu.stat_selection >= actor._paramPlus.length) Cheat_Menu.stat_selection = 0;
			var statsArray = [];
			for (var i = 0; i < actor._paramPlus.length; i++) {
				statsArray.push($dataSystem.terms.params[i] || "Stat " + i);
			}
			var statSection = Cheat_Menu.createSection();
			statSection.appendChild(Cheat_Menu.createAmountSelector());
			var cardSection = Cheat_Menu.createCardGrid("Select Stat", statsArray, Cheat_Menu.stat_selection, function(i) {
				Cheat_Menu.stat_selection = i;
			}, function(i, statName) {
				return statName;
			}, function(i, statName) {
				return "Value: " + actor._paramPlus[i];
			});
			statSection.appendChild(cardSection);
			var selectedSection = Cheat_Menu.createSection("Selected: " + statsArray[Cheat_Menu.stat_selection]);
			var valueGroup = Cheat_Menu.createInputGroup("Current Value", actor._paramPlus[Cheat_Menu.stat_selection],
				function() {
					Cheat_Menu.give_stat(actor, Cheat_Menu.stat_selection, -Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();
		SoundManager.playSystemSound(2);
				},
				function() {
					Cheat_Menu.give_stat(actor, Cheat_Menu.stat_selection, Cheat_Menu.amounts[Cheat_Menu.amount_index]);
					Cheat_Menu.update_menu();
		SoundManager.playSystemSound(1);
	}
			);
			selectedSection.appendChild(valueGroup);
			statSection.appendChild(selectedSection);
			section.appendChild(statSection);
		}
		contentArea.appendChild(section);
	},
	gold: function(contentArea) {
		var section = Cheat_Menu.createSection();
		section.appendChild(Cheat_Menu.createAmountSelector());
		section.appendChild(Cheat_Menu.createInputGroup("Current Gold", $gameParty._gold,
			function() {
				Cheat_Menu.give_gold(-Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();
		SoundManager.playSystemSound(2);
			},
			function() {
				Cheat_Menu.give_gold(Cheat_Menu.amounts[Cheat_Menu.amount_index]);
				Cheat_Menu.update_menu();
		SoundManager.playSystemSound(1);
	}
		));
		contentArea.appendChild(section);
	},
	items: function(contentArea) { Cheat_Menu.buildItemMenu(contentArea, "item"); },
	weapons: function(contentArea) { Cheat_Menu.buildItemMenu(contentArea, "weapon"); },
	armors: function(contentArea) { Cheat_Menu.buildItemMenu(contentArea, "armor"); },
	speed: function(contentArea) {
		var section = Cheat_Menu.createSection();
		section.appendChild(Cheat_Menu.createInputGroup("Speed Amount", Cheat_Menu.move_amounts[Cheat_Menu.move_amount_index],
			function() {
				if (Cheat_Menu.move_amount_index > 0) Cheat_Menu.move_amount_index--;
	Cheat_Menu.update_menu();
		SoundManager.playSystemSound(2);
			},
			function() {
				if (Cheat_Menu.move_amount_index < Cheat_Menu.move_amounts.length - 1) Cheat_Menu.move_amount_index++;
				Cheat_Menu.update_menu();
		SoundManager.playSystemSound(1);
	}
		));
		section.appendChild(Cheat_Menu.createInputGroup("Current Speed", $gamePlayer._moveSpeed,
			function() {
				Cheat_Menu.change_player_speed(-Cheat_Menu.move_amounts[Cheat_Menu.move_amount_index]);
	Cheat_Menu.update_menu();
		SoundManager.playSystemSound(2);
			},
			function() {
				Cheat_Menu.change_player_speed(Cheat_Menu.move_amounts[Cheat_Menu.move_amount_index]);
				Cheat_Menu.update_menu();
		SoundManager.playSystemSound(1);
	}
		));
		section.appendChild(Cheat_Menu.createToggleButton("Speed Lock", !Cheat_Menu.speed_unlocked, function() {
			Cheat_Menu.toggle_lock_player_speed();
			SoundManager.playSystemSound(Cheat_Menu.speed_unlocked ? 2 : 1);
	Cheat_Menu.update_menu();
		}));
		contentArea.appendChild(section);
	},
	states: function(contentArea) {
		var section = Cheat_Menu.createSection();
		section.appendChild(Cheat_Menu.createButton("Clear All Party States", function() {
	Cheat_Menu.clear_party_states();
	SoundManager.playSystemSound(1);
		}));
		section.appendChild(Cheat_Menu.createActorSelector());
		var selectedSection = Cheat_Menu.createSection("Selected Actor");
		var actor = $gameActors._data[Cheat_Menu.cheat_selected_actor];
		var count = (actor && actor._states) ? actor._states.length : 0;
		selectedSection.appendChild(Cheat_Menu.createButton("Clear Actor States (Count: " + count + ")", function() {
			Cheat_Menu.clear_actor_states(actor);
		SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
		}));
		section.appendChild(selectedSection);
		contentArea.appendChild(section);
	},
	variables: function(contentArea) {
		var section = Cheat_Menu.createSection();
		section.appendChild(Cheat_Menu.createAmountSelector());
		var cardSection = Cheat_Menu.createCardGrid("Select Variable", $dataSystem.variables, Cheat_Menu.variable_selection, function(i) {
			Cheat_Menu.variable_selection = i;
		}, function(i, varName) {
			return (varName && varName.length > 0) ? varName : "Variable " + i;
		}, function(i, varName) {
			var value = $gameVariables.value(i);
			return "Value: " + (value != undefined ? value : "NULL");
		});
		section.appendChild(cardSection);
		var selectedSection = Cheat_Menu.createSection("Selected: " + (($dataSystem.variables[Cheat_Menu.variable_selection] && $dataSystem.variables[Cheat_Menu.variable_selection].length > 0) 
			? $dataSystem.variables[Cheat_Menu.variable_selection] : "Variable " + Cheat_Menu.variable_selection));
		var value = $gameVariables.value(Cheat_Menu.variable_selection);
		selectedSection.appendChild(Cheat_Menu.createInputGroup("Current Value", value != undefined ? value : "NULL",
			function() {
				Cheat_Menu.set_variable(Cheat_Menu.variable_selection, -Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();
		SoundManager.playSystemSound(2);
			},
			function() {
				Cheat_Menu.set_variable(Cheat_Menu.variable_selection, Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();
				SoundManager.playSystemSound(1);
			}
		));
		section.appendChild(selectedSection);
		contentArea.appendChild(section);
	},
	switches: function(contentArea) {
		var section = Cheat_Menu.createSection();
		var cardSection = Cheat_Menu.createCardGrid("Select Switch", $dataSystem.switches, Cheat_Menu.switch_selection, function(i) {
			Cheat_Menu.switch_selection = i;
		}, function(i, switchName) {
			return (switchName && switchName.length > 0) ? switchName : "Switch " + i;
		}, function(i, switchName) {
			var value = $gameSwitches.value(i);
			return "Status: " + (value ? "ON" : "OFF");
		});
		section.appendChild(cardSection);
		var selectedSection = Cheat_Menu.createSection("Selected: " + (($dataSystem.switches[Cheat_Menu.switch_selection] && $dataSystem.switches[Cheat_Menu.switch_selection].length > 0)
			? $dataSystem.switches[Cheat_Menu.switch_selection] : "Switch " + Cheat_Menu.switch_selection));
		var value = $gameSwitches.value(Cheat_Menu.switch_selection);
		selectedSection.appendChild(Cheat_Menu.createToggleButton("Status", value, function() {
			Cheat_Menu.toggle_switch(Cheat_Menu.switch_selection);
			SoundManager.playSystemSound($gameSwitches.value(Cheat_Menu.switch_selection) ? 1 : 2);
			Cheat_Menu.update_menu();
		}));
		section.appendChild(selectedSection);
		contentArea.appendChild(section);
	},
	positions: function(contentArea) {
		var section = Cheat_Menu.createSection();
		var mapInfo = $dataMapInfos[$gameMap.mapId()];
		var currentMap = mapInfo ? ($gameMap.mapId() + ": " + mapInfo.name) : "NULL";
		var infoDiv = document.createElement('div');
		infoDiv.className = "cheat-info";
		infoDiv.innerHTML = "<strong>Current Position:</strong><br>" + currentMap + "<br>(" + $gamePlayer.x + ", " + $gamePlayer.y + ")";
		section.appendChild(infoDiv);
		for (var i = 0; i < Cheat_Menu.saved_positions.length; i++) {
			var pos = Cheat_Menu.saved_positions[i];
			var posSection = Cheat_Menu.createSection("Position " + (i+1));
			var mapText = pos.m != -1 ? (pos.m + ": " + ($dataMapInfos[pos.m] ? $dataMapInfos[pos.m].name : "NULL")) : "NULL";
			var posText = pos.m != -1 ? ("(" + pos.x + ", " + pos.y + ")") : "NULL";
			var infoDiv2 = document.createElement('div');
			infoDiv2.className = "cheat-info-small";
			infoDiv2.textContent = mapText;
			posSection.appendChild(infoDiv2);
			var btnGrid = document.createElement('div');
			btnGrid.className = "cheat-btn-grid";
			btnGrid.appendChild(Cheat_Menu.createButton("Save", function(idx) {
				return function() {
					Cheat_Menu.saved_positions[idx].m = $gameMap.mapId();
					Cheat_Menu.saved_positions[idx].x = $gamePlayer.x;
					Cheat_Menu.saved_positions[idx].y = $gamePlayer.y;
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
};
			}(i)));
			btnGrid.appendChild(Cheat_Menu.createButton("Recall: " + posText, function(idx) {
				return function() {
					if (Cheat_Menu.saved_positions[idx].m != -1) {
						Cheat_Menu.teleport(Cheat_Menu.saved_positions[idx].m, Cheat_Menu.saved_positions[idx].x, Cheat_Menu.saved_positions[idx].y);
		SoundManager.playSystemSound(1);
					} else {
		SoundManager.playSystemSound(2);
	}
	Cheat_Menu.update_menu();
};
			}(i)));
			posSection.appendChild(btnGrid);
			section.appendChild(posSection);
		}
		contentArea.appendChild(section);
	},
	teleport: function(contentArea) {
		var section = Cheat_Menu.createSection();
		var mapsArray = [];
		for (var i = 1; i < $dataMapInfos.length; i++) {
			if ($dataMapInfos[i]) {
				mapsArray.push({id: i, name: $dataMapInfos[i].name || "Map " + i});
			}
		}
		var currentMapIndex = 0;
		for (var j = 0; j < mapsArray.length; j++) {
			if (mapsArray[j].id === Cheat_Menu.teleport_location.m) {
				currentMapIndex = j;
				break;
			}
		}
		var cardSection = Cheat_Menu.createCardGrid("Select Map", mapsArray, currentMapIndex, 
			function(i) {
				Cheat_Menu.teleport_location.m = mapsArray[i].id;
			}, function(i, map) {
				return map.id + ": " + map.name;
			}, null);
		section.appendChild(cardSection);
		section.appendChild(Cheat_Menu.createInputGroup("X", Cheat_Menu.teleport_location.x,
			function() {
				Cheat_Menu.teleport_location.x = (Cheat_Menu.teleport_location.x - 1 + 256) % 256;
	Cheat_Menu.update_menu();
	SoundManager.playSystemSound(0);
			},
			function() {
				Cheat_Menu.teleport_location.x = (Cheat_Menu.teleport_location.x + 1) % 256;
	Cheat_Menu.update_menu();
				SoundManager.playSystemSound(0);
			}
		));
		section.appendChild(Cheat_Menu.createInputGroup("Y", Cheat_Menu.teleport_location.y,
			function() {
				Cheat_Menu.teleport_location.y = (Cheat_Menu.teleport_location.y - 1 + 256) % 256;
				Cheat_Menu.update_menu();
	SoundManager.playSystemSound(0);
			},
			function() {
				Cheat_Menu.teleport_location.y = (Cheat_Menu.teleport_location.y + 1) % 256;
	Cheat_Menu.update_menu();
				SoundManager.playSystemSound(0);
			}
		));
		section.appendChild(Cheat_Menu.createButton("Teleport", function() {
	Cheat_Menu.teleport(Cheat_Menu.teleport_location.m, Cheat_Menu.teleport_location.x, Cheat_Menu.teleport_location.y);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
		}, "cheat-btn-primary"));
		contentArea.appendChild(section);
	}
};

Cheat_Menu.buildMenuContent = function(container) {
	var contentArea = container.querySelector('.cheat-menu-content');
	contentArea.innerHTML = '';
	var menuId = Cheat_Menu.menuDefinitions[Cheat_Menu.cheat_selected].id;
	if (menuBuilders[menuId]) menuBuilders[menuId](contentArea);
};

Cheat_Menu.menuContainer = null;
Cheat_Menu.scrollPositions = {};

Cheat_Menu.update_menu = function() {
	if (!Cheat_Menu.menuContainer) {
		Cheat_Menu.menuContainer = Cheat_Menu.createMenuContainer();
		document.body.appendChild(Cheat_Menu.menuContainer);
		Cheat_Menu.menuContainer.addEventListener("mousedown", function(event) {
			event.stopPropagation();
		});
	}
	
	// Save scroll positions of all card grids before update
	var contentArea = Cheat_Menu.menuContainer.querySelector('.cheat-menu-content');
	if (contentArea) {
		var grids = contentArea.querySelectorAll('.cheat-card-grid');
		for (var i = 0; i < grids.length; i++) {
			var grid = grids[i];
			if (grid.dataset.gridId) {
				Cheat_Menu.scrollPositions[grid.dataset.gridId] = grid.scrollTop;
			}
		}
	}
	
	Cheat_Menu.createSidebar(Cheat_Menu.menuContainer);
	Cheat_Menu.buildMenuContent(Cheat_Menu.menuContainer);
	
	// Restore scroll positions after DOM update
	// Only restore if user is not actively scrolling
	var restoreScrollAttempts = 0;
	var restoreScroll = function() {
		if (contentArea) {
			var grids = contentArea.querySelectorAll('.cheat-card-grid');
			for (var i = 0; i < grids.length; i++) {
				var grid = grids[i];
				if (grid.dataset.gridId && Cheat_Menu.scrollPositions[grid.dataset.gridId] !== undefined) {
					// Check if user is actively scrolling this grid
					var isUserScrolling = grid.isScrolling || false;
					if (!isUserScrolling) {
						var savedPos = Cheat_Menu.scrollPositions[grid.dataset.gridId];
						grid.scrollTop = savedPos;
						// Try again if scroll didn't set correctly
						if (Math.abs(grid.scrollTop - savedPos) > 1 && restoreScrollAttempts < 2) {
							restoreScrollAttempts++;
							requestAnimationFrame(restoreScroll);
							return;
						}
					}
				}
			}
		}
	};
	// Use requestAnimationFrame to ensure DOM is ready
	requestAnimationFrame(function() {
		restoreScrollAttempts = 0;
		restoreScroll();
	});
};

/////////////////////////////////////////////////
// Key Listener
/////////////////////////////////////////////////

if (typeof Cheat_Menu.keyCodes == "undefined") { Cheat_Menu.keyCodes = {}; }
Cheat_Menu.keyCodes.KEYCODE_1 = {keyCode: 49};
Cheat_Menu.keyCodes.KEYCODE_LEFT = {keyCode: 37};
Cheat_Menu.keyCodes.KEYCODE_RIGHT = {keyCode: 39};
Cheat_Menu.keyCodes.KEYCODE_ESCAPE = {keyCode: 27};

window.addEventListener("keydown", function(event) {
	if (!event.ctrlKey && !event.altKey && (event.keyCode === 119) && $gameTemp && !$gameTemp.isPlaytest()) {
		event.stopPropagation();
		event.preventDefault();
		require('nw.gui').Window.get().showDevTools();
	}
	else if (!event.altKey && !event.ctrlKey && !event.shiftKey && (event.keyCode === 120) && $gameTemp && !$gameTemp.isPlaytest()) {
		$gameTemp._isPlaytest = true;
		setTimeout(function() { $gameTemp._isPlaytest = false; }, 100);
	}
	else if (Cheat_Menu.overlay_openable && !event.altKey && !event.ctrlKey && !event.shiftKey) {
		if (event.keyCode == Cheat_Menu.keyCodes.KEYCODE_1.keyCode) {
			if (!Cheat_Menu.initialized) {
				for (var i = 0; i < $gameActors._data.length; i++) {
					if($gameActors._data[i]) {
						$gameActors._data[i].god_mode = false;
						if ($gameActors._data[i].god_mode_interval) clearInterval($gameActors._data[i].god_mode_interval);
						}
					}
				for (var name in Cheat_Menu.initial_values) {
					Cheat_Menu[name] = Cheat_Menu.initial_values[name];
				}
				if ($gameSystem.Cheat_Menu) {
					for (var name in $gameSystem.Cheat_Menu) {
						Cheat_Menu[name] = $gameSystem.Cheat_Menu[name];
					}
				}
				if (Cheat_Menu.speed_unlocked == false) Cheat_Menu.initialize_speed_lock();
				Cheat_Menu.initialized = true;
			}
			if (!Cheat_Menu.cheat_menu_open) {
				Cheat_Menu.cheat_menu_open = true;
				Cheat_Menu.update_menu();
				SoundManager.playSystemSound(1);
			} else {
				Cheat_Menu.cheat_menu_open = false;
				if (Cheat_Menu.menuContainer) {
					Cheat_Menu.menuContainer.remove();
					Cheat_Menu.menuContainer = null;
				}
				SoundManager.playSystemSound(2);
			}
		}
		else if (Cheat_Menu.cheat_menu_open) {
			if (event.keyCode == Cheat_Menu.keyCodes.KEYCODE_LEFT.keyCode) {
				Cheat_Menu.cheat_selected = (Cheat_Menu.cheat_selected - 1 + Cheat_Menu.menuDefinitions.length) % Cheat_Menu.menuDefinitions.length;
				Cheat_Menu.update_menu();
				SoundManager.playSystemSound(0);
			}
			else if (event.keyCode == Cheat_Menu.keyCodes.KEYCODE_RIGHT.keyCode) {
				Cheat_Menu.cheat_selected = (Cheat_Menu.cheat_selected + 1) % Cheat_Menu.menuDefinitions.length;
				Cheat_Menu.update_menu();
				SoundManager.playSystemSound(0);
			}
			else if (event.keyCode == Cheat_Menu.keyCodes.KEYCODE_ESCAPE.keyCode) {
				Cheat_Menu.cheat_menu_open = false;
				if (Cheat_Menu.menuContainer) {
					Cheat_Menu.menuContainer.remove();
					Cheat_Menu.menuContainer = null;
				}
				SoundManager.playSystemSound(2);
			}
		}
	}
});

/////////////////////////////////////////////////
// Load Hook
/////////////////////////////////////////////////

Cheat_Menu.initialize = function() {
	Cheat_Menu.overlay_openable = true;
	Cheat_Menu.initialized = false;
	Cheat_Menu.cheat_menu_open = false;
	Cheat_Menu.speed_initialized = false;
	if (Cheat_Menu.menuContainer) {
		Cheat_Menu.menuContainer.remove();
		Cheat_Menu.menuContainer = null;
	}
	clearInterval(Cheat_Menu.menu_update_timer);
	Cheat_Menu.menu_update_timer = setInterval(function() {
		if (Cheat_Menu.cheat_menu_open) {
			// Check if user is actively scrolling any grid
			var contentArea = Cheat_Menu.menuContainer ? Cheat_Menu.menuContainer.querySelector('.cheat-menu-content') : null;
			if (contentArea) {
				var grids = contentArea.querySelectorAll('.cheat-card-grid');
				var isUserScrolling = false;
				for (var i = 0; i < grids.length; i++) {
					if (grids[i].isScrolling) {
						isUserScrolling = true;
						break;
					}
				}
				// Only update if user is not scrolling
				if (!isUserScrolling) {
					Cheat_Menu.update_menu();
				}
			} else {
				Cheat_Menu.update_menu();
			}
		}
	}, 1000);
};

DataManager.default_loadGame = DataManager.loadGame;
DataManager.loadGame = function(savefileId) {
	Cheat_Menu.initialize();
	return DataManager.default_loadGame(savefileId);
};

DataManager.default_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function() {
	Cheat_Menu.initialize();
	DataManager.default_setupNewGame();
};

DataManager.default_saveGame = DataManager.saveGame;
DataManager.saveGame = function(savefileId) {
	$gameSystem.Cheat_Menu = {};
	for (var name in Cheat_Menu.initial_values) {
		$gameSystem.Cheat_Menu[name] = Cheat_Menu[name];
	}
	return DataManager.default_saveGame(savefileId);
};
