import { AeObject, aex } from './aex';
import { AEX_COMP_ITEM, AEX_PROJECT } from './constants';
import { cleanupAex, evalAexIntoEstk, openCleanProject } from './csinterface';
import { assertAreEqual } from './utils';

describe.skip('Rafi Test Stuff', function () {
    this.slow(500);
    this.timeout(2000);

    let project: any;

    const projectData = {
        comps: [
            {
                aexid: 'comp 1:1',
                duration: 4,
                folder: [],
                frameRate: 60,
                height: 720,
                layers: [],
                markers: [
                    {
                        duration: 0.2,
                        time: 0.1667,
                    },
                    {
                        comment: 'Some Comment',
                        duration: 1,
                        label: 4,
                        protectedRegion: true,
                        time: 0.4667,
                    },
                    {
                        label: 3,
                        time: 0.7833,
                    },
                    {
                        comment: 'banana',
                        time: 1.8333,
                    },
                    {
                        duration: 0.3333,
                        protectedRegion: true,
                        time: 3.55,
                    },
                ],
                name: 'DetailedMarkers',
                pixelAspect: 1,
                type: AEX_COMP_ITEM,
                width: 1280,
            },
            {
                aexid: 'comp 2:2',
                duration: 4,
                folder: [],
                frameRate: 60,
                height: 720,
                layers: [],
                markers: [
                    {
                        time: 0.1667,
                    },
                    {
                        time: 0.4667,
                    },
                    {
                        time: 0.7833,
                    },
                    {
                        time: 1.8333,
                    },
                    {
                        time: 3.55,
                    },
                ],
                name: 'PlainMarkers',
                pixelAspect: 1,
                type: AEX_COMP_ITEM,
                width: 1280,
            },
        ],
        items: [],
        type: AEX_PROJECT,
    };

    before(async () => {
        await evalAexIntoEstk();
        await openCleanProject();

        await aex().update(AeObject.Project, projectData);

        const result = await aex().fromAeObject(AeObject.Project);
        project = result.object;
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Deserialize Simple`, async () => {
        assertAreEqual(project.comps[1].markers, projectData.comps[1].markers);
    });

    it(`Deserialize Complex`, async () => {
        assertAreEqual(project.comps[0].markers, projectData.comps[0].markers);
    });

    /*
    before(async () => {
        await evalAexIntoEstk();
        await openProject('testAssets/property_unsupported.aep');
    });

    after(async () => {
        await cleanupAex();
    });

    it(`Sanity testing callback mechanism`, async () => {
        let called = false;

        await aex().benchmark({
            callback: (result) => {
                called = true;
                expect(result).to.be.true;
            },
        });

        expect(called, 'callback invoked').to.be.true;
    });

    it(`Can get log of serialization failures`, async () => {
        const result = await aex().fromAeObject(AeObject.ActiveComp, {
            unspportedPropertyBehavior: 'log',
        });

        expect(result.object).to.be.ok;
        expect(result.log[0].message).to.contain('is unsupported');
    });

    it(`Can get a callback during serialization failure`, async () => {
        let called = false;

        await aex().fromAeObject(AeObject.ActiveComp, {
            unspportedPropertyBehavior: ({ aexProperty, message }) => {
                called = true;

                expect(aexProperty).to.deep.contain({
                    type: AEX_NONE_PROPERTY,
                    name: 'Colors',
                });

                expect(message).to.contain('is unsupported');
            },
        });

        expect(called, 'callback invoked').to.be.true;
    });
    */
});
