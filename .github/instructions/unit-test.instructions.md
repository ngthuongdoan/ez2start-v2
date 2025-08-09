---
applyTo: "**/*.tsx"
description: "Unit test writing conventions"
---

# Unit Test Instructions
- Use Jest for all unit tests.
- Name test files with `.test.jsx` suffix.
- Include clear, descriptive test names.

# Advice & Pointers
All the test functions are customized under `utils/test/testing-library` E.g.:
```javascript
import {
  renderComponentWithRedux,
  screen,
  fireEvent,
} from 'utils/test/testing-library';
```
- If it needs some functions under `utils/helper`, here is the mock E.g.:
```javascript
jest.mock('utils/helper', () => {
  const originalModule = jest.requireActual('utils/helper');
  return {
    __esModule: true,
    ...originalModule,
    api: {
      get: jest.fn(),
      post: jest.fn(),
    },
  };
});
```
- If it needs the `pages/MessageResource`, here is the mock E.g.:
```javascript
jest.mock('pages/MessageResource', () => ({
  __esModule: true,
  useMessageResource: jest.fn(() => jest.fn((key) => key)),
  withLazyMessageResource: jest.fn(() => jest.fn((Component) => Component)),
}));
```
- If `utils/noti` is being used, here is the mock. E.g.:
```javascript
import noti from 'utils/noti';
.....
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(noti, 'someThingWentWrong').mockImplementation(jest.fn());
    jest
      .spyOn(noti, 'yourChangesHaveBeenSavedSuccessfully')
      .mockImplementation(jest.fn());
  });
```
