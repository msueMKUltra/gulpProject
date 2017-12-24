"use strict";$(function(){({power:100,walk:function(){this.power-=10},fly:function(){this.power-=20},check:function(i){this.power>0&&i()},showoff:function(){this.check(function(){this.walk(),this.fly()}.bind(this))}}).showoff();(function(){}).bind({x:3})()});
//# sourceMappingURL=react_01.js.map
