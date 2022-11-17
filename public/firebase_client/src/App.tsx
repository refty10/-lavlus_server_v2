import {GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import {auth} from './util/firebase';
import {
  Container,
  Center,
  Stack,
  Button,
  Text,
  useDisclosure,
  Link,
  useToast,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import copy from 'clipboard-copy';

function App() {
  const onSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log(credential);
    } catch (err) {
      console.error(err);
    }
  };

  const toast = useToast();
  const onCopyToken = async () => {
    if (auth.currentUser) {
      copy(await auth.currentUser.getIdToken());
      toast({
        title: 'Success',
        description: 'トークンをクリップボードにコピーしました',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error',
        description: 'トークンのにコピーに失敗しました',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const onSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <Container w="100vw" h="100vh">
        <Center w="100%" h="100%">
          <Stack gap={8}>
            <Link href="/home.html" color="teal.500" textAlign="center">
              Loopback4 Home Page
            </Link>
            <Button onClick={onSignIn} colorScheme="green">
              Google SignIn
            </Button>
            <Button onClick={onOpen} colorScheme="orange">
              Show Auth
            </Button>
            <Button onClick={onCopyToken} colorScheme="blue">
              Copy Token
            </Button>
            <Button onClick={onSignOut} colorScheme="red">
              Google SignOut
            </Button>
          </Stack>
        </Center>
      </Container>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        size="full"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>OAuth Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text as="pre" overflow="hidden">
              {JSON.stringify(auth.currentUser, null, 2)}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default App;
