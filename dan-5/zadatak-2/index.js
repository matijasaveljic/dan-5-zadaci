document.addEventListener('DOMContentLoaded', function(){
    const label = document.getElementById('labelInput');
    const button = document.getElementById('inputButton');
    const boxContainer = document.getElementById('boxContainer');
    const plus = document.getElementById('plus');
    const minus = document.getElementById('minus');
    const char = document.getElementById('charInput');
    const place = document.getElementById('place');
    // const letter = document.getElementsByClassName('input-inside-boxes');
    // const boxbox = document.getElementsByClassName('boxes');

    function generator(label){
        boxContainer.innerHTML='';

        for(let i=0; i<label; i++){
            const box = document.createElement('div');
            box.className = 'boxes';
            
            const input = document.createElement('input');
            input.className = 'input-inside-boxes';
            input.maxLength='1';
            box.appendChild(input);
            boxContainer.appendChild(box);
        }
    }

    generator(parseInt(label.value, 10));

    button.addEventListener('click', function(){
        const labellabel = parseInt(label.value, 10);
        generator(labellabel);
    });

    plus.addEventListener('click', function(){
        const oneBox = document.createElement('div');
        oneBox.classList.add('boxes');
        const input = document.createElement('input');
        input.className = 'input-inside-boxes';
        input.maxLength='1';
        oneBox.appendChild(input);
        boxContainer.appendChild(oneBox);

    });

    minus.addEventListener('click', function(){
        const minusBox = boxContainer.lastChild;

        if(minusBox){
            boxContainer.removeChild(minusBox);
        }
    })

  
    

});

