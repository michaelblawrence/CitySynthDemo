using CitySynth.UI_Elements;
using System;

namespace CitySynth.Helpers
{
    public static class Bindings
    {
        /// <summary>
        /// Links a Dial control's value to an output variable value.
        /// </summary>
        /// <param name="variable">Scaled output variable.</param>
        /// <param name="sender">Dial control object.</param>
        public static bool LinkVar(out float variable, object sender)
        {
            variable = (sender as Dial).GetScaledValue();
            return true;
        }

        /// <summary>
        /// Links a Dial control's value to a callback parameter value.
        /// </summary>
        /// <param name="variable">Scaled output variable.</param>
        /// <param name="sender">Dial control object.</param>
        public static bool LinkVar(Action<float> callback, object sender)
        {
            callback((sender as Dial).GetScaledValue());
            return true;
        }
        /// <summary>
        /// Type of Toggle control class
        /// </summary>
        private static Type Toggle = new ToggleIcon().GetType();

        /// <summary>
        /// Type of Dial control class
        /// </summary>
        private static Type Dial = new Dial().GetType();

        /// <summary>
        /// Links a Toggle Icon control's value to an output variable value.
        /// </summary>
        /// <param name="variable">Boolean output variable.</param>
        /// <param name="sender">Toggle Icon control object.</param>
        public static bool LinkVar(out bool variable, object sender)
        {
            if (sender.GetType() == Toggle)
                variable = (sender as ToggleIcon).Checked;
            else if (sender.GetType() == Dial)
                variable = (sender as Dial).Inactive;
            variable = false;
            return variable;
        }

        public static void Run(object expressionResult)
        {

        }
    }


}