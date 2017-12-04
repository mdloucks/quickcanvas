class MapGenerator {

    /**
     * 
     * @param {*} mapLayout 
     * @param {*} isChunked 
     */
    static generate(mapLayout, isChunked) {

        // create a copy of mapLayout to be filled with newly generated terrain
        let map = [mapLayout.length];
        for (let i = 0; i < mapLayout.length; i++) {
            map.push(new Array(mapLayout[i].length));
        }
        map.shift();

        console.log('generating ' + mapLayout.length + ' x ' + mapLayout[0].length + ' map...');
        for (let r = 0; r < mapLayout.length; r++) {
            for (let c = 0; c < mapLayout[r].length; c++) {

                try {
                    if (MapKey[mapLayout[r][c]] === undefined) {
                        //throw new Error(`mapLayout[${r}][${c}] is undefined`);
                        continue;
                    }
                    if (mapLayout[r][c] > Object.keys(MapConstants.types).length - 1) {
                        throw new Error(`A tile key type is out of range of the accepted values
accepted: 0-${MapConstants.length - 1}  recieved: MapKey[${r}][${c}] ${MapKey[r][c]}`);
                    }

                    if (MapKey[mapLayout[r][c]].type == KeyConstants.types.EMPTY) {
                        continue;
                    }

                    // if the type of the map key matches that of anything in a certain group, fill that index with that group type
                    // in this case it would be terrain created
                    for (let i = 0; i < KeyConstants.terrain.length; i++) {
                        if (MapKey[mapLayout[r][c]].type == KeyConstants.terrain[i]) {
                            map[r][c] = new Terrain(mapLayout[r][c],
                                c * MapConstants.TILE_WIDTH + MapConstants.x, r * MapConstants.TILE_HEIGHT + MapConstants.y);
                            continue;
                        }
                    }

                    for (let i = 0; i < KeyConstants.walls.length; i++) {
                        if (MapKey[mapLayout[r][c]].type == KeyConstants.walls[i]) {
                            map[r][c] = new Wall(mapLayout[r][c], c * MapConstants.TILE_WIDTH + MapConstants.x, r * MapConstants.TILE_HEIGHT + MapConstants.y,
                                MapConstants.TILE_WIDTH, MapConstants.TILE_HEIGHT);
                            continue;
                        }
                    }
                    map[r][c] = new Terrain(mapLayout[r][c],
                        c * MapConstants.TILE_WIDTH + MapConstants.x, r * MapConstants.TILE_HEIGHT + MapConstants.y);

                    // map[r][c] = new AnimatedTerrain(mapLayout[r][c], 100,
                    //     c * MapConstants.TILE_WIDTH + MapConstants.x, r * MapConstants.TILE_HEIGHT + MapConstants.y);

                } catch (err) {
                    console.log('error while generating map at row:' + r + ' col: ' + c);
                    console.log(err);
                }
            }
        }
        return map
    }

    /**
     * add a chunk to the right hand side of a map
     * 
     * @param {Array} map map to append chunk to
     * @param {Array} chunk chunk to be added to map
     * @param {Number} row what row to insert chunk into
     * 
     * @default row will start at row 0
     */
    static appendChunk(map, chunk, row) {

        for (let r = 0; r < map.length; r++) {
            map[r + row] = map[r + row].concat(chunk[r]);
        }
    }
    /**
     * 
     * @param {Array} map the original map
     * @param {Array} chunk the 3d array to be added to the map
     * @param {Number} row the row or 'y' to start at
     * @param {Number} col the collumn or 'x' to start at
     * 
     * @description add a given chunk to the map provided in the first parameter at specified coordinates.
     * The chunk can be added anywhere onto the map except a negative row/col. It can even be added onto the current map.
     * 
     */
    static addChunk(map, chunk, row, col) {

        if (chunk.length + row > map.length) {
            console.log(chunk.length + row - map.length);
            for (let i = 0; i < chunk.length + (row - 4) + row - map.length; i++) {
                map.push(new Array(col - 1).fill(0));
            }
        }
        for (let r = 0; r < chunk.length; r++) {
            for (let c = 0; c < chunk[r].length; c++) {
                map[row + r][col + c] = chunk[r][c];
            }
        }
    }
};