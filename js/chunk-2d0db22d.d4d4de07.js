(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0db22d"],{"6f29":function(e,t,o){"use strict";o.r(t);var n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[e._v(" meo mewo this is blog "),o("b-button",{on:{click:e.sendEmit}},[e._v(" send emit to room")]),o("b-button",{on:{click:e.sendEmit2}},[e._v(" send emit to id")])],1)},i=[],s={name:"BlogHomePage",methods:{sendEmit:function(){this.socket.emit("tellme",localStorage.getItem("usdb"))},sendEmit2:function(){this.socket.emit("tellme2")},listener:function(e){console.log(e)}},mounted:function(){this.socket.on("meow",this.listener)},beforeDestroy:function(){this.socket.off("meow",this.listener)}},c=s,l=o("2877"),m=Object(l["a"])(c,n,i,!1,null,"6bd27e5f",null);t["default"]=m.exports}}]);