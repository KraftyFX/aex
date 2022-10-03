import { AeObject, aex, getFilePath, getProject } from '../aex';
import { AEX_FILE_FOOTAGE_ITEM, TEST_TIMEOUT_TIME } from '../constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from '../csinterface';
import { assertAreEqual } from '../utils';

describe('File', function () {
    this.slow(500);
    this.timeout(TEST_TIMEOUT_TIME);
    let stillPath: string;
    let seqPath: string;
    let dataPath: string;
    let audioPath: string;

    before(async () => {
        await evalAexIntoEstk();
        stillPath = getFilePath('Juvenile_Ragdoll.jpg');
        seqPath = getFilePath('seq/img.0000.jpg');
        dataPath = getFilePath('table.csv');
        audioPath = getFilePath('en-us-cheese.mp3');
    });

    after(async () => {
        await cleanupAex();
    });

    describe('Still Files', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_files.aep', AeObject.Project);

            const items = result.object.items;

            console.log('files', items[0]);
            assertAreEqual(items[0], {
                aexid: '01_still:1',
                file: stillPath,
                label: 5,
                name: '01_Still',
                type: AEX_FILE_FOOTAGE_ITEM,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const itemData = {
                aexid: 'juvenile_ragdoll.jpg:1',
                file: stillPath,
                label: 5,
                name: 'Juvenile_Ragdoll.jpg',
                type: AEX_FILE_FOOTAGE_ITEM,
            };

            await aex.create(AeObject.Project, itemData);

            const result = await aex.get(AeObject.Project);
            const items = result.object.items;

            assertAreEqual(items[0], itemData);
        });
    });

    describe('Sequences', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_files.aep', AeObject.Project);

            const items = result.object.items;

            console.log('file_sequence', items[1]);
            assertAreEqual(items[1], {
                aexid: '02_sequence:2',
                conformFrameRate: 30,
                file: seqPath,
                label: 3,
                name: '02_Sequence',
                sequence: true,
                type: AEX_FILE_FOOTAGE_ITEM,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const itemData = {
                aexid: 'img.[0000-0001].jpg:1',
                conformFrameRate: 30,
                file: seqPath,
                label: 3,
                name: 'img.[0000-0001].jpg',
                sequence: true,
                type: AEX_FILE_FOOTAGE_ITEM,
            };

            await aex.create(AeObject.Project, itemData);

            const result = await aex.get(AeObject.Project);
            const items = result.object.items;

            assertAreEqual(items[0], itemData);
        });
    });

    describe('Data Files', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_files.aep', AeObject.Project);

            const items = result.object.items;

            console.log('data_file', items[2]);
            assertAreEqual(items[2], {
                aexid: '03_csv:3',
                file: dataPath,
                label: 0,
                name: '03_CSV',
                type: AEX_FILE_FOOTAGE_ITEM,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const itemData = {
                aexid: 'table.csv:1',
                file: dataPath,
                label: 0,
                name: 'table.csv',
                type: AEX_FILE_FOOTAGE_ITEM,
            };

            await aex.create(AeObject.Project, itemData);

            const result = await aex.get(AeObject.Project);
            const items = result.object.items;

            assertAreEqual(items[0], itemData);
        });
    });

    describe('Audio Files', async () => {
        it(`Get`, async () => {
            const result = await getProject('assets/project_files.aep', AeObject.Project);

            const items = result.object.items;

            console.log('audio_file', items[3]);
            assertAreEqual(items[3], {
                aexid: '04_audio:4',
                file: audioPath,
                label: 7,
                name: '04_Audio',
                type: AEX_FILE_FOOTAGE_ITEM,
            });
        });

        it(`Create`, async () => {
            await openCleanProject();

            const itemData = {
                aexid: 'en-us-cheese.mp3:1',
                file: dataPath,
                label: 7,
                name: 'en-us-cheese.mp3',
                type: AEX_FILE_FOOTAGE_ITEM,
            };

            await aex.create(AeObject.Project, itemData);

            const result = await aex.get(AeObject.Project);
            const items = result.object.items;

            assertAreEqual(items[0], itemData);
        });
    });
});
