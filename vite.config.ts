import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Figma asset aliases only - no versioned package aliases
      'figma:asset/f78a7afc12530559ccf2a06e587dc281bcd4f462.png': path.resolve(__dirname, './src/assets/f78a7afc12530559ccf2a06e587dc281bcd4f462.png'),
      'figma:asset/ef08d3f22c4abc4edffa8cecec7e2f230e846e07.png': path.resolve(__dirname, './src/assets/ef08d3f22c4abc4edffa8cecec7e2f230e846e07.png'),
      'figma:asset/e7d7c7c2966484419543840c53fb5a4e0fcf13ee.png': path.resolve(__dirname, './src/assets/e7d7c7c2966484419543840c53fb5a4e0fcf13ee.png'),
      'figma:asset/e47a87f6be6bec5dd98303c11be2a7d05192b4db.png': path.resolve(__dirname, './src/assets/e47a87f6be6bec5dd98303c11be2a7d05192b4db.png'),
      'figma:asset/e45e3ee4eba71949f29d76d45845399fdf3cc9ec.png': path.resolve(__dirname, './src/assets/e45e3ee4eba71949f29d76d45845399fdf3cc9ec.png'),
      'figma:asset/d5869f642c3bf678f44032b2f6b88c61f81c77d7.png': path.resolve(__dirname, './src/assets/d5869f642c3bf678f44032b2f6b88c61f81c77d7.png'),
      'figma:asset/cf24d4b2e20a15517df0ad783ec7725a2446262f.png': path.resolve(__dirname, './src/assets/cf24d4b2e20a15517df0ad783ec7725a2446262f.png'),
      'figma:asset/cd8fb78bbdf449467265bf24ba5e7431f5ec4c88.png': path.resolve(__dirname, './src/assets/cd8fb78bbdf449467265bf24ba5e7431f5ec4c88.png'),
      'figma:asset/c79630a57397a42d08372eba673fd92e28c4bf5f.png': path.resolve(__dirname, './src/assets/c79630a57397a42d08372eba673fd92e28c4bf5f.png'),
      'figma:asset/c529c127dfab3cef5d58627a1ada6e1fc58f2228.png': path.resolve(__dirname, './src/assets/c529c127dfab3cef5d58627a1ada6e1fc58f2228.png'),
      'figma:asset/b3726364eeb0d34c85633f4cf53d3732960fd502.png': path.resolve(__dirname, './src/assets/b3726364eeb0d34c85633f4cf53d3732960fd502.png'),
      'figma:asset/a9cccfce217e308a6223d25c688de37e91812ba1.png': path.resolve(__dirname, './src/assets/a9cccfce217e308a6223d25c688de37e91812ba1.png'),
      'figma:asset/a292b19e84a1f879f651078f73cedfa89b695975.png': path.resolve(__dirname, './src/assets/a292b19e84a1f879f651078f73cedfa89b695975.png'),
      'figma:asset/9f63944965e128ef41765601ab1847ee83c9e0a6.png': path.resolve(__dirname, './src/assets/9f63944965e128ef41765601ab1847ee83c9e0a6.png'),
      'figma:asset/9773dbaa1279463ba7491a29151fce5122f37c13.png': path.resolve(__dirname, './src/assets/9773dbaa1279463ba7491a29151fce5122f37c13.png'),
      'figma:asset/94fe5419ed9304104582750fe20291b933363ab5.png': path.resolve(__dirname, './src/assets/94fe5419ed9304104582750fe20291b933363ab5.png'),
      'figma:asset/8ac7206aa536287c035f3c6493199fab97d75c35.png': path.resolve(__dirname, './src/assets/8ac7206aa536287c035f3c6493199fab97d75c35.png'),
      'figma:asset/85d7c7c4122eabf7a386c89a2f076b726c8ae043.png': path.resolve(__dirname, './src/assets/85d7c7c4122eabf7a386c89a2f076b726c8ae043.png'),
      'figma:asset/81788ef723085af5b13348f2920671e790c6e37d.png': path.resolve(__dirname, './src/assets/81788ef723085af5b13348f2920671e790c6e37d.png'),
      'figma:asset/7f668d5c60871817ec827331f1798976f2a7933c.png': path.resolve(__dirname, './src/assets/7f668d5c60871817ec827331f1798976f2a7933c.png'),
      'figma:asset/779d074eef190f1f86cc79b512c47b760156c721.png': path.resolve(__dirname, './src/assets/779d074eef190f1f86cc79b512c47b760156c721.png'),
      'figma:asset/710e546fb9d9ce7f6408f775b374a11d3fbfba1a.png': path.resolve(__dirname, './src/assets/710e546fb9d9ce7f6408f775b374a11d3fbfba1a.png'),
      'figma:asset/6f2d32c7b968f23926b63d45e30b91cc2da997e4.png': path.resolve(__dirname, './src/assets/6f2d32c7b968f23926b63d45e30b91cc2da997e4.png'),
      'figma:asset/6e1f7ff7a0d2aa0a313a90da33aa60053d91ea17.png': path.resolve(__dirname, './src/assets/6e1f7ff7a0d2aa0a313a90da33aa60053d91ea17.png'),
      'figma:asset/682c7d5747cd1d06db9152fdad6632ea976e7370.png': path.resolve(__dirname, './src/assets/682c7d5747cd1d06db9152fdad6632ea976e7370.png'),
      'figma:asset/60ed396847644589035678224a0b7bc534dea427.png': path.resolve(__dirname, './src/assets/60ed396847644589035678224a0b7bc534dea427.png'),
      'figma:asset/601e7061b9ddeb364e9e0b84e1b1f2d6ff59cc8e.png': path.resolve(__dirname, './src/assets/601e7061b9ddeb364e9e0b84e1b1f2d6ff59cc8e.png'),
      'figma:asset/576031ac054495e449ac924f9abf38728c280801.png': path.resolve(__dirname, './src/assets/576031ac054495e449ac924f9abf38728c280801.png'),
      'figma:asset/52616a432da32590de2bcc9eea1aab39206d78ea.png': path.resolve(__dirname, './src/assets/52616a432da32590de2bcc9eea1aab39206d78ea.png'),
      'figma:asset/4bf250083dafea26bfa8ac1fd8dc4cafa7c3abd3.png': path.resolve(__dirname, './src/assets/4bf250083dafea26bfa8ac1fd8dc4cafa7c3abd3.png'),
      'figma:asset/368a7d15ca5b6e70e27e103b9ccaa5ac597aacf1.png': path.resolve(__dirname, './src/assets/368a7d15ca5b6e70e27e103b9ccaa5ac597aacf1.png'),
      'figma:asset/330de5fedd35324a8ac6ceda812f7b0fc85e2d70.png': path.resolve(__dirname, './src/assets/330de5fedd35324a8ac6ceda812f7b0fc85e2d70.png'),
      'figma:asset/310a4746e885b9f5fe5356e8d70538691ce7713d.png': path.resolve(__dirname, './src/assets/310a4746e885b9f5fe5356e8d70538691ce7713d.png'),
      'figma:asset/2d2444680e2439a26648e717446132340d732694.png': path.resolve(__dirname, './src/assets/2d2444680e2439a26648e717446132340d732694.png'),
      'figma:asset/28430c67d8c56fe9f234da28c61f3e751f5f0995.png': path.resolve(__dirname, './src/assets/28430c67d8c56fe9f234da28c61f3e751f5f0995.png'),
      'figma:asset/2020782692714b32c8ee36fa6ef9e2204c0e6618.png': path.resolve(__dirname, './src/assets/2020782692714b32c8ee36fa6ef9e2204c0e6618.png'),
      'figma:asset/1ea6553c03e11978b12888ebba7d2635616a891f.png': path.resolve(__dirname, './src/assets/1ea6553c03e11978b12888ebba7d2635616a891f.png'),
      'figma:asset/1dd6cbf4ce4f18e1647a937b98fed883f4f2b8a2.png': path.resolve(__dirname, './src/assets/1dd6cbf4ce4f18e1647a937b98fed883f4f2b8a2.png'),
      'figma:asset/169b573abbaf94c8982b7cfff18daf9efeee2bc6.png': path.resolve(__dirname, './src/assets/169b573abbaf94c8982b7cfff18daf9efeee2bc6.png'),
      'figma:asset/10d825dfec23f3432297112e377a926e8c75c90c.png': path.resolve(__dirname, './src/assets/10d825dfec23f3432297112e377a926e8c75c90c.png'),
      'figma:asset/0d3bd51805e8ff13fc5bf4a492ce0192f08308ba.png': path.resolve(__dirname, './src/assets/0d3bd51805e8ff13fc5bf4a492ce0192f08308ba.png'),
      'figma:asset/094ce126a4f8b5e2664c17ed28bf24370a5161c7.png': path.resolve(__dirname, './src/assets/094ce126a4f8b5e2664c17ed28bf24370a5161c7.png'),
      'figma:asset/02cc89c779d8fc04d82233b370e8c58938483c6b.png': path.resolve(__dirname, './src/assets/02cc89c779d8fc04d82233b370e8c58938483c6b.png'),
    },
  },
  define: {
    'process.env': {},
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 5173,
    open: true,
  },
});