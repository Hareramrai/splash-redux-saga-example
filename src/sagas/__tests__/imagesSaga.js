import { runSaga } from 'redux-saga';

import { getPage, handleImagesLoad } from '../imagesSaga';
import * as api from '../../api';
import { setImages, setError } from '../../actions';

test('selector should return the desired page', () => {
    const nextPage = 1;
    const state = { nextPage };
    const res = getPage(state);
    expect(res).toBe(nextPage);
});

test('should load and handle images in case of success', async () => {
    const dispatchedActions = [];

    const mockedImages = ['img1', 'img2'];
    api.fetchImages = jest.fn(() => Promise.resolve(mockedImages));

    const fakeStore = {
        getState: () => ({ nextPage: 1 }),
        dispatch: action => dispatchedActions.push(action),
    };

    await runSaga(fakeStore, handleImagesLoad).done;

    expect(api.fetchImages.mock.calls.length).toBe(1);
    expect(dispatchedActions).toContainEqual(setImages(mockedImages));
});

test('should handle image load errors in case of failure', async () => {
    const dispatchedActions = [];

    const error = 'API server is down';
    api.fetchImages = jest.fn(() => Promise.reject(error));

    const fakeStore = {
        getState: () => ({ nextPage: 1 }),
        dispatch: action => dispatchedActions.push(action),
    };

    await runSaga(fakeStore, handleImagesLoad).done;

    expect(api.fetchImages.mock.calls.length).toBe(1);
    expect(dispatchedActions).toContainEqual(setError(error));
});
