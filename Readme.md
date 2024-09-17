MULTILAYER CACHING.
1.I implemented simple caching using javascript classes.
2.Features:-
a.We can create as many caching layers as we want.
b.Each caching layer supports LRU eviction policy.
c.Whenever we add a new element ,It always go to layer1.
d.Whenever we search for an element,We go from top layer to bottom.
e.When we get the element,We promote it to upper layer.If upper layer is filled then we envict an element from the upper layer and envicted element get stored in lower layer.

3.Code Description:-
a.We have two classes in this:CacheLayer,MultilayerCache.
b.CacheLayer is a blueprint of each layer that tells about what method functions and method variables we do have .
c.MultiLayerCache is a blueprint of whole caching system.If we want different-different caching systems on module level then we can create multiple objects of this.
d.MultiLayerCache has all functions like get, set,promoteToHigherLayer.

4.I have installed Nodemon,so you just need to run it once.

5.PROCESS TO RUN ON YOUR LOCAL MACHINE:
a.clone this repo.
b.Install node modules with command: npm init
c.run command: Nodemon cachingAssignment.js
d.You are good to go---------------------------------------------------------------.

6.IF YOU FACE ANY PROBLEM PLEASE CONTACT ME AT: sachinsiddhu112@gmail.com or https://www.linkedin.com/in/sachin-siddhu-687269248/ or https://twitter.com/SachinSidd50843



THANKS FOR VISITING MY WORK.