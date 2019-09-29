using CitySynth.State;
using System;
using System.Windows.Forms;

namespace CitySynth.Helpers
{
    public static class MidiHelpers
    {
        /// <summary>
        /// Converts keyboard key press code to frequency of pitch
        /// </summary>
        /// <param name="keyCode">Computer keyboard key code</param>
        /// <returns>Frequency of pressed keyboard note</returns>
        public static float KeyToFreq(int keyCode)
        {
            return KeyToFreq(keyCode, R.BaseFrequency);
        }
        /// <summary>
        /// Converts keyboard key press code to frequency of pitch
        /// </summary>
        /// <param name="keyCode">Computer keyboard key code</param>
        /// <param name="a4Freq">Tuning of keyboard. Frequency of A4: </param>
        /// <returns>Frequency of pressed keyboard note</returns>
        public static float KeyToFreq(int keyCode, float a4Freq)
        {
            int st = -2;
            if (keyCode < 256)
                switch ((Keys)keyCode)
                {
                    //Keyboard Keys
                    case Keys.Q:
                        st = -1;
                        break;
                    case Keys.A:
                        st = 0;
                        break;
                    case Keys.W:
                        st = 1;
                        break;
                    case Keys.S:
                        st = 2;
                        break;
                    case Keys.E:
                        st = 3;
                        break;
                    case Keys.D:
                        st = 4;
                        break;
                    case Keys.F:
                        st = 5;
                        break;
                    case Keys.T:
                        st = 6;
                        break;
                    case Keys.G:
                        st = 7;
                        break;
                    case Keys.Y:
                        st = 8;
                        break;
                    case Keys.H:
                        st = 9;
                        break;
                    case Keys.U:
                        st = 10;
                        break;
                    case Keys.J:
                        st = 11;
                        break;
                    case Keys.K:
                        st = 12;
                        break;
                    case Keys.O:
                        st = 13;
                        break;
                    case Keys.L:
                        st = 14;
                        break;
                    case Keys.P:
                        st = 15;
                        break;
                    case Keys.OemSemicolon:
                        st = 16;
                        break;
                    case Keys.Oemtilde:
                        st = 17;
                        break;
                }
            else
            //if ((ind = ke.IndexOf(keyCode)) >= 0 && vels[ind] != 0)
            {
                st = keyCode - 300 + 12;
                a4Freq *= (float)Math.Pow(2, R.MidiOctaveShift);
            }

            if (st == -2)
                return -1;
            else
            {
                //float mult = 1;
                int key = R.kb_off + st;
                //if (key > 12) mult = key / 12;
                float factor = Form1.semitones[(key + 12) % 12] * (float)(Math.Pow(2, (int)Math.Floor(key / 12.0f)));
                return a4Freq * factor;
            }
        }
    }
}