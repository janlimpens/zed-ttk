use zed_extension_api::{self as zed};

struct TtkExtension;

impl zed::Extension for TtkExtension {
    fn new() -> Self {
        TtkExtension
    }
}

zed::register_extension!(TtkExtension);
