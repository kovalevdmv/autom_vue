const myObject = { key1: "value1", key2: "value2", key3: "value3" };

for (const key in myObject) {
  console.log(key, myObject[key]);
}