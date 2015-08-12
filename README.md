# NCKUClassWeb

成大學生自製虛擬課表網站: http://nckuclass.5gb.co/

目前僅有簡單結構，程式碼部份還有很大改善空間，歡迎pull request

原作者是網頁程式與github的初學者，大家可以一起學習互相指教．


* 開發理念：快速、易懂


Development Environment:

	- Ubuntu 15.10

	- LAMP (apache, MySQL, PHP)

	OR

	- Windows

	- XAMPP

Coding Style：

	縮排4格, operator前後需空格, 盡可能簡潔
	
	以Java的naming rule 
    請參考wiki的Java部份https://en.wikipedia.org/wiki/Naming_convention_%28programming%29


該改什麼：

	請參考issue的部份，也歡迎提出問題 


程式說明：
	
	Parse的流程請參考 img/flow_chart.png
	
	JS function流程：
			init() -> user按加入 -> addClass -> checkClassInList -> findClass(maj,num) ->
			獲取xml資料/判斷是否有子課程 -> pushClassContent -> printClass

	printClass
		|
		---- update學分 ---- 判斷time是否未定 ---format time --- 若只有一堂課 --- printClassSingle
                                                                      |
													                  ---else --- printClassMulti

Parser：

	Parser目前因code過於雜亂，待修改過後放上

commit rule：

	請參考https://github.com/torvalds/linux/commits/master

	希望英文為主

Contributors:

	Lecopzer (Jian-Lin Chen) <james455096@gmail.com>  ME-104
	
