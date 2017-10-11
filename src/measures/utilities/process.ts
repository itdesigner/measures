import * as os from 'os';

/**
 * CPU state information
 * 
 * @export
 * @type CpuState
 */
export type CpuState = {
    /**
     * cpu idle value
     * 
     * @type {number}
     * @memberof CpuState
     */
    idle:number;
    /**
     * cpu total value
     * 
     * @type {number}
     * @memberof CpuState
     */
    total:number;
}
/**
 * memory state information
 * 
 * @export
 * @type MemoryState
 */
export type MemoryState = {
    /**
     * total memory
     * 
     * @type {number}
     * @memberof MemoryState
     */
    total:number;
    /**
     * free memory
     * 
     * @type {number}
     * @memberof MemoryState
     */
    free:number;
}

//Create function to get CPU information
/**
 * get the current CPU state
 * 
 * @export
 * @returns {CpuState} 
 */
export function getCpu(): CpuState {
    //Initialise sum of idle and time of cores and fetch CPU info
    let totalIdle:number = 0;
    let totalTick:number = 0;
    var cpus:os.CpuInfo[] = os.cpus();

    //Loop through CPU cores
    for(var i = 0, len = cpus.length; i < len; i++) {
        //Select CPU core
        let cpu:os.CpuInfo = cpus[i];
        //Total up the time in the cores tick
        totalTick += (cpu.times.idle + cpu.times.irq + cpu.times.nice + cpu.times.sys + cpu.times.user);    
        //Total up the idle time of the core
        totalIdle += cpu.times.idle;
    }
    //Return the average Idle and Tick times
    return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}
/**
 * calculate a single average cpu utilization across all cores
 * 
 * @export
 * @param {ICpuState} startCpu 
 * @param {ICpuState} endCpu 
 * @returns {number} 
 */
export function averageCpu( startCpu:CpuState, endCpu:CpuState):number {
    var idleDifference = endCpu.idle - startCpu.idle;
    var totalDifference = endCpu.total - startCpu.total;
    //Calculate the average percentage CPU usage
    var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
    return percentageCPU;
}
/**
 * gets current memory values
 * 
 * @export
 * @returns {IMemoryState} 
 */
export function getMemory():MemoryState {
    return {
        total:os.totalmem(),
        free:os.freemem()
    }
}

