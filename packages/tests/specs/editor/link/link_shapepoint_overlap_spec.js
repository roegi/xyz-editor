/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */
import {editorTests, testUtils, prepare} from 'hereTest';
import {Map} from '@here/xyz-maps-core';
import {features, Editor} from '@here/xyz-maps-editor';
import dataset from './link_shapepoint_overlap_spec.json';

describe('verify Link overlapped shape point style', function() {
    const expect = chai.expect;

    let editor;
    let display;
    let preparedData;
    let mapContainer;

    let link1; let link2;

    before(async function() {
        preparedData = await prepare(dataset);
        display = new Map(document.getElementById('map'), {
            renderOptions: {
                preserveDrawingBuffer: true
            },
            center: {longitude: 77.37037, latitude: 13.09307},
            zoomLevel: 17,
            layers: preparedData.getLayers()
        });
        editor = new Editor(display, {
            layers: preparedData.getLayers()
        });
        await editorTests.waitForEditorReady(editor);
        mapContainer = display.getContainer();

        link1 = preparedData.getFeature('linkLayer', -189081);
        link2 = preparedData.getFeature('linkLayer', -189082);
    });

    after(async function() {
        editor.destroy();
        display.destroy();
        await preparedData.clear();
    });

    it('select one link and click, valiate overlapped shapepoint is highlighted', async function() {
        link1.select();
        await testUtils.events.click(mapContainer, 300, 200);

        let overlay = editor.getOverlay();
        let nodes = overlay.search(display.getViewBounds());
        expect(nodes[1].properties.isOverlapping).to.be.true;
    });

    it('select the other link and click, valiate overlapped shapepoint is highlighted', async function() {
        link2.select();
        await testUtils.events.click(mapContainer, 200, 100);

        let overlay = editor.getOverlay();
        let nodes = overlay.search(display.getViewBounds());
        expect(nodes[1].properties.isOverlapping).to.be.true;
    });
});
