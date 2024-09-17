class CacheLayer {
  constructor(size, evictionPolicy = 'LRU') {
    this.size = size;
    this.evictionPolicy = evictionPolicy;
    this.cache = new Map(); // Stores the data as key-value pairs
    this.usageOrder = []; // Helps in eviction (LRU or FIFO)
  }

  // Method to get the data from the cache
  get(key) {
    if (this.cache.has(key)) {
      if (this.evictionPolicy === 'LRU') {
        this.updateUsageOrder(key);
      }
      return this.cache.get(key);
    }
    return null;
  }

  // Method to set the data in the cache
  set(key, value) {
    let evictedKeyAndValue = null;
    if (this.cache.size >= this.size) {
      evictedKeyAndValue = this._evict();
    }
    this.cache.set(key, value);
    this.updateUsageOrder(key);
    return evictedKeyAndValue;
  }

  // Method to handle eviction based on policy
  _evict() {
    let evictedKey;
    if (this.evictionPolicy === 'LRU' || this.evictionPolicy === 'FIFO') {
      evictedKey = this.usageOrder.shift(); // Remove the least recently used 
    }
    let value = this.cache.get(evictedKey);
    this.cache.delete(evictedKey);
    return { key: evictedKey, value };
  }

  // Method to update usage order for LRU policy
  updateUsageOrder(key) {
    // Remove the key from the usage order array if it already exists
    this.usageOrder = this.usageOrder.filter(item => item !== key);
    this.usageOrder.push(key); // Add it to the end (most recently used)
  }

  // Method to remove key from usage order
  removeUsageOrder(key) {
    this.usageOrder = this.usageOrder.filter(item => item !== key);
    this.cache.delete(key);
  }
}

class MultiLayerCache {
  constructor() {
    this.layers = [];
  }

  // Add a cache layer with a specific size and eviction policy
  addLayer(size, evictionPolicy) {
    const newLayer = new CacheLayer(size, evictionPolicy);
    this.layers.push(newLayer);
  }

  // Get data from the multi-layer cache
  get(key) {
    for (let i = 0; i < this.layers.length; i++) {
      const value = this.layers[i].get(key);
      if (value !== null) {
        // Once found in a lower layer, propagate to higher layers
        this._promoteToHigherLayers(i - 1, key, value);
        console.log("layer index" , i);
        return value;
      }
    }
    return null; // Data not found in any layer
  }

  // Set data into the top-most layer and propagate downwards
  set(key, value) {
    let evictedKeyAndValue = this.layers[0].set(key, value);
    let i = 1;

    // Loop for adding evicted key-value into the next lower cache layer.
    while (evictedKeyAndValue != null && i < this.layers.length) {
      evictedKeyAndValue = this.layers[i].set(evictedKeyAndValue.key, evictedKeyAndValue.value);
      i++;
    }
  }

  // Method to promote data to higher layers when found in a lower layer
  _promoteToHigherLayers(i, key, value) {
    if (i >= 0) {
      let evictedKeyAndValue = this.layers[i].set(key, value);//setting got value into upper layer and if size already full then evicted key from upper layer is setting into lower layer.
      this.layers[i + 1].removeUsageOrder(key); // Remove from the lower layer's usage
      //following the loop till we reached the lowest layer.
      //if size of lowest layer is full then evicting least recently used value in lowest layer.
      i+=1;
      while (i < this.layers.length  && evictedKeyAndValue != null) {
        evictedKeyAndValue = this.layers[i].set(evictedKeyAndValue.key, evictedKeyAndValue.value);
        i++;
      }
    }
  }
}

// Example usage:

// Create a multi-layer cache
const multiLayerCache = new MultiLayerCache();

// Add multiple layers with specific sizes and eviction policies
multiLayerCache.addLayer(3, 'LRU'); // Layer 1: size 3, eviction policy LRU
multiLayerCache.addLayer(2, 'LRU'); // Layer 2: size 2, eviction policy LRU

// Add data
multiLayerCache.set('a', 1);
multiLayerCache.set('b', 2);
multiLayerCache.set('c', 3);
multiLayerCache.set('d', 4); // a will be evicted from layer 0 ,moved to layer1.

multiLayerCache.set('e',5);// b moved to layer 1 ,layer 1 filled.
multiLayerCache.set('f',6);//c moved to lyaer 1 ,a will be eviceted from layer 1.

console.log(multiLayerCache.get('c'))//should be in layer1.and promoted to layer 0.
console.log(multiLayerCache.get('c'))// should be in layer 0.and d moved to layer 1
                                    //  because of eviction policy.
console.log(multiLayerCache.get('b'))
console.log(multiLayerCache.get('d'))
