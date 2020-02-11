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

// @ts-ignore
import vertexShader from '../glsl/text_vertex.glsl';
// @ts-ignore
import fragmentShader from '../glsl/text_fragment.glsl';

import {JSUtils} from '@here/xyz-maps-common';
import Program from './Program';
import {GLStates} from './GLStates';

class TextProgram extends Program {
    name = 'Text';

    glStates = new GLStates({
        blend: true,
        scissor: false,
        depth: true
    });

    constructor(gl: WebGLRenderingContext, devicePixelRation: number) {
        super(gl, gl.TRIANGLES, vertexShader, fragmentShader, devicePixelRation);
    }

    pass(pass: string) {
        // draw text in alpha pass only
        return pass == 'alpha';
    }

    init(options: GLStates) {
        const {gl} = this;
        super.init(options);
        // using LEQUAL and write to depthbuffer used as default in alpha pass will
        // lead to lost context on some systems (driverbug?!)
        // this issues is also related to overlapping (atlas.spacing) of characters
        gl.depthMask(false);
        // gl.depthFunc(gl.LESS);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
}

export default TextProgram;
