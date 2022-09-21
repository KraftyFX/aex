import { AeObject, aex, getFilePath, getProject } from '../aex';
import { AEX_FILE_FOOTAGE_ITEM, AEX_PROJECT, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe.only('Solids', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);
    let filePath: string;

    before(async () => {
        await evalAexIntoEstk();
        filePath = getFilePath('Juvenile_Ragdoll.jpg');
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Color', async () => {
        it.skip(`Get TODO`, async () => {});
        it.skip(`Create TODO`, async () => {});
        it.skip(`Update TODO`, async () => {});
    });
});
