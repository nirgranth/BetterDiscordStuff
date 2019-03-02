//META{"name":"AccountSwitcher","displayName":"AccountSwitcher","website":"https://twitter.com/l0c4lh057/","source":"https://github.com/l0c4lh057/BetterDiscordStuff/blob/master/Plugins/AccountSwitcher/AccountSwitcher.plugin.js"}*//

class AccountSwitcher {
	getName(){return "AccountSwitcher";}
	getAuthor(){return "l0c4lh057";}
	getVersion(){return "0.0.9";}
	getDescription(){return "Switch between multiple accounts with AltLeft+1 up to AltLeft+0";}
	
	
	get defaultSettings(){
		return {
			name1: "",
			token1: "",
			name2: "",
			token2: "",
			name3: "",
			token3: "",
			name4: "",
			token4: "",
			name5: "",
			token5: "",
			name6: "",
			token6: "",
			name7: "",
			token7: "",
			name8: "",
			token8: "",
			name9: "",
			token9: "",
			name10: "",
			token10: ""
		}
	}
	
	
	start(){
		let libLoadedEvent = () => {
            try{ this.onLibLoaded(); }
            catch(err) { console.error(this.getName(), "fatal error, plugin could not be started!", err); try { this.stop(); } catch(err) { console.error(this.getName() + ".stop()", err); } }
        };
		let lib = document.getElementById("NeatoBurritoLibrary");
		if(!lib) {
			lib = document.createElement("script");
			lib.id = "NeatoBurritoLibrary";
			lib.type = "text/javascript";
			lib.src = "https://rawgit.com/Metalloriff/BetterDiscordPlugins/master/Lib/NeatoBurritoLibrary.js";
			document.head.appendChild(lib);
		}
        if(typeof window.NeatoLib !== "undefined") libLoadedEvent();
		else lib.addEventListener("load", libLoadedEvent);
		if(!document.getElementById("0b53rv3r5cr1p7")){
			let observerScript = document.createElement("script");
			observerScript.id = "0b53rv3r5cr1p7";
			observerScript.type = "text/javascript";
			observerScript.src = "https://l0c4lh057.github.io/BetterDiscord/Plugins/Scripts/pluginlist.js";
			document.head.appendChild(observerScript);
		}
	}
	onLibLoaded(){
		NeatoLib.Updates.check(this, "https://raw.githubusercontent.com/l0c4lh057/BetterDiscordStuff/master/Plugins/AccountSwitcher/AccountSwitcher.plugin.js");
		this.AccountManager = NeatoLib.Modules.get(["loginToken"]);
		this.UserInfoStore = NeatoLib.Modules.get(["getToken"]);
		this.settings = NeatoLib.Settings.load(this, this.defaultSettings);
		this.registerKeybinds();
	}
	stop(){
		this.unregisterKeybinds();
	}
	
	saveSettings() {
		NeatoLib.Settings.save(this);
	}
	
	
	
	unregisterKeybinds() {
		for(let i = 1; i < 11; i++){
			NeatoLib.Keybinds.detachListener("accountswitcher-keybind-" + i);
		}
	}

	registerKeybinds() {
		for(let i = 1; i < 11; i++){
			let keybind = {
				primaryKey : "Digit" + (i % 10),
				modifiers : ["AltLeft"]
			};
			NeatoLib.Keybinds.attachListener("accountswitcher-keybind-" + i, keybind, () => {
				let token = this.settings["token" + i];
				if(token == this.UserInfoStore.getToken()){
					NeatoLib.showToast("You're already using this account", "error");
				}else if(token.length > 10){
					this.AccountManager.loginToken(this.settings["token" + i]);
					location.reload();
				}else{
					NeatoLib.showToast("Token " + i + " is not valid", "error");
				}
			});
		}
	}
	
	
	
	getSettingsPanel() {
		setTimeout(() => {
			NeatoLib.Settings.pushElement(this.createWarning(), this.getName());
			for(let i = 1; i < 11; i++){
				NeatoLib.Settings.pushElement(this.createTextField("Account " + i, this.settings["name" + i], this.settings["token" + i], "Account name (can be whatever you want)", "Account token", 
				e => {
					this.settings["name" + i] = e.target.value;
					this.saveSettings();
				},
				e => {
					this.settings["token" + i] = e.target.value;
					this.saveSettings();
				}), this.getName());
			}
			NeatoLib.Settings.pushElement(NeatoLib.Settings.Elements.createButton("Copy token of current account", e => {
				let tempInput = document.createElement("input");
				document.body.appendChild(tempInput);
				tempInput.setAttribute('value', this.UserInfoStore.getToken())
				tempInput.select();
				document.execCommand('copy');
				document.body.removeChild(tempInput);
				NeatoLib.showToast("Token copied", "success");
			}, "margin-top:10px;"), this.getName());
			NeatoLib.Settings.pushElement(NeatoLib.Settings.Elements.createButton("Get support", e => {
				window.open("https://l0c4lh057.github.io/discord.html");
			}, "margin-left:10px;margin-top:10px;"), this.getName());
		}, 0);

		return this.pluginNameLabel(this.getName());
	}
	
	pluginNameLabel(name) {
		return `
			<style>
				#bd-settingspane-container *::-webkit-scrollbar {
					max-width: 10px;
				}

				#bd-settingspane-container *::-webkit-scrollbar-track-piece {
					background: transparent;
					border: none;
					border-radius: 5px;
				}

				#bd-settingspane-container *:hover::-webkit-scrollbar-track-piece {
					background: #2F3136;
					border-radius: 5px;
				}

				#bd-settingspane-container *::-webkit-scrollbar-thumb {
					background: #1E2124;
					border: none;
					border-radius: 5px;
				}

				#bd-settingspane-container *::-webkit-scrollbar-button {
					display: none;
				}
			</style>
			<h style="color: #ccc;font-size: 30px;font-weight: bold;">${name.replace(/([A-Z])/g, ' $1').trim()} by l0c4lh057</h>`;
	}
	
	createTextField(label, value1, value2, placeholder1, placeholder2, callback1, callback2, options = {}) {
		let element = document.createElement("div");
		element.style.paddingTop = options.spacing || "20px";
		element.insertAdjacentHTML("beforeend", `
			<style>
				.neato-text-field-p {
					color: white;
					font-size: 20px;
					display: inline;
				}
			</style>
			<div class="neato-text-field-p" style="max-width:20%;">${label}</div>
			<input value="${value1}" placeholder="${placeholder1}" type="${"text"}" style="${NeatoLib.Settings.Styles.textField}width:30%;margin-left:10px;">
			<input value="${value2}" placeholder="${placeholder2}" type="${"password"}" style="${NeatoLib.Settings.Styles.textField};width:50%;">
		`);
		element.querySelectorAll("input")[0].addEventListener(options.callbackType || "focusout", e => callback1(e));
		element.querySelectorAll("input")[1].addEventListener(options.callbackType || "focusout", e => callback2(e));
		element.querySelectorAll("input")[1].addEventListener(options.callbackType || "focusin", e => e.target.type = "text");
		element.querySelectorAll("input")[1].addEventListener(options.callbackType || "focusout", e => e.target.type = "password");
		return element;
	}
	
	createWarning(){
		let element = document.createElement("div");
		element.insertAdjacentHTML("beforeend", `
			<style>
				.accountswitcher.warning {
					color: #ff1919;
					padding-top: 20px;
				}
			</style>
			<div class="accountswitcher warning">Do <strong>NOT</strong> share any of your tokens with someone else. Otherwise they can use your account with all actions that don't need a password. This can't be prevented by 2fa.<br>If you think someone has your token, enable 2fa and change your password. For both actions your account will get a new token. But don't forget to change the token in this settings!</div>
		`);
		return element;
	}
}
